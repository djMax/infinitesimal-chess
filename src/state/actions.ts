import { beginBatch, endBatch, Observable } from '@legendapp/state';
import * as Clipboard from 'expo-clipboard';
import { Platform, Share } from 'react-native';

import { getBaseState, GameState, ObservableGameState, AppState } from '.';
import { GameMove } from './types';
import { assignRemoteDb, crashlyticsLog } from '../adapters/firebase';
import { defaultBoard } from '../models';
import { Piece } from '../models/Piece';
import { Position } from '../models/Position';
import { Knight } from '../models/pieces/Knight';
import { Pawn } from '../models/pieces/Pawn';
import { getOverlappingPieces } from '../models/topology';
import { findThreats } from '../models/topology/planning';
import { Direction } from '../models/types';

export function resetGame(pieces = defaultBoard(), whiteToMove: boolean = true, allowAi = false) {
  GameState.assign({
    ...getBaseState(),
    allowAi,
    pieces,
  });
}

// Commit the proposed move and update state
export function completeProposedMove(state: ObservableGameState) {
  const raw = state.peek();
  const { pieceId, direction, distance, variant } = raw.proposed;

  const pieceIndex = raw.pieces.findIndex((p) => p.id === pieceId);
  const rawPiece = raw.pieces[pieceIndex];
  const newPos = rawPiece.getScaledMove(raw, direction!, distance, variant);
  return completeMove(state, rawPiece, direction!, variant, newPos);
}

export function completeMove(
  state: ObservableGameState,
  rawPiece: Piece,
  direction: Direction,
  variant: string | undefined,
  newPos: Position,
) {
  const raw = state.peek();
  crashlyticsLog(
    `Move ${rawPiece.id} ${
      rawPiece.black ? 'B' : 'W'
    } ${rawPiece.position.toString()} -> ${newPos.toString()}`,
  );
  const moveId = raw.moveCount;
  const move: GameMove = {
    id: String(moveId),
    p: rawPiece.id,
    d: direction!,
    v: variant,
    to: [newPos.x, newPos.y],
    t: Date.now(),
  };

  if (raw.multiplayer.gameId) {
    // TODO handle errors.
    assignRemoteDb(`games/${raw.multiplayer.gameId}/m/${move.id}`, move);
    state.moveCount.set(moveId + 1);
  }

  state.proposed.assign({
    pieceId: undefined,
    direction: undefined,
    availableDirections: [],
    position: undefined,
    distance: 1,
  });

  const taken = applyMove(rawPiece.id, newPos);

  state.pieces.forEach((p) => {
    // Reset all the cached values
    if (p.isProposed) {
      p.isProposed.set(false);
    }
    if (p.canThreaten.peek()) {
      p.canThreaten.set(false);
    }
    if (p.threatened.peek()) {
      p.threatened.set(false);
    }
    if (p.proposedPositionWillBeThreatened.peek()) {
      p.proposedPositionWillBeThreatened.set(false);
    }
  });

  return { move, taken };
}

export function proposePiece(piece: Observable<Piece>) {
  const game = GameState.peek();
  const rawPiece = piece.peek();
  if (game.whiteToMove === piece.black.get() || piece.id.get() === game.proposed.pieceId) {
    return;
  }
  const d = rawPiece.availableDirections(game);
  beginBatch();
  if (game.proposed.pieceId && game.proposed.pieceId !== piece.id.peek()) {
    const exPiece = game.pieces.findIndex((p) => p.id === game.proposed.pieceId!);
    GameState.pieces[exPiece].isProposed.set(false);
  }
  GameState.proposed.assign({
    pieceId: rawPiece.id,
    direction: d.length === 1 ? d[0] : undefined,
    availableDirections: d,
    distance: 0,
    position: rawPiece.position,
    variant: rawPiece.moveVariants[0],
  });
  piece.isProposed.set(true);
  endBatch();

  requestAnimationFrame(() => {
    const allInvolved = new Set();
    const rawPiece = piece.peek();
    d.forEach((dir) => {
      // Find the overlapping piece for this direction
      const end = piece.getMaximumMove(game, dir);
      const overlap =
        rawPiece instanceof Knight
          ? rawPiece.getTargets(dir, game)
          : getOverlappingPieces(rawPiece, end, game.pieces);
      if (overlap?.pieces.length) {
        overlap.pieces.forEach((p) => {
          if (p.black !== piece.black.peek()) {
            allInvolved.add(p.id);
          }
        });
      }
    });
    beginBatch();
    game.pieces.forEach((p, ix) => {
      const canThreaten = p.canThreaten;
      const nowCanThreaten = allInvolved.has(p.id);
      if (canThreaten && !nowCanThreaten) {
        GameState.pieces[ix].canThreaten.set(false);
      } else if (!canThreaten && nowCanThreaten) {
        GameState.pieces[ix].canThreaten.set(true);
      }
    });
    endBatch();
  });
}

export function setMoveScale(scale: number, updateThreats = false) {
  const game = GameState.peek();
  const piece = game.pieces.find((p) => p.id === game.proposed.pieceId)!;
  const newPosition = piece.getScaledMove(
    game,
    game.proposed.direction!,
    scale,
    game.proposed.variant,
  );
  GameState.proposed.assign({
    distance: scale,
    position: newPosition,
    valid: piece.isValid(game, newPosition),
  });
  if (updateThreats) {
    AppState.spinner.set(true);
    const threats = findThreats(game, piece, newPosition);

    for (let i = 0; i < game.pieces.length; i += 1) {
      const t = game.pieces[i];
      if (t.canThreaten) {
        const distance = t.position.squareDistance(newPosition);
        const isThreatened = distance < (t.radius + piece.radius) ** 2;
        if (isThreatened !== t.threatened) {
          GameState.pieces[i].threatened.set(isThreatened);
        }
        if (!isThreatened) {
          // Ok, is this in the list of pieces to hit me?
          if (threats.find((op) => t.id === op.piece.id)) {
            GameState.pieces[i].proposedPositionWillBeThreatened.set(true);
          } else if (t.proposedPositionWillBeThreatened) {
            GameState.pieces[i].proposedPositionWillBeThreatened.set(false);
          }
        }
      } else if (t.black !== piece.black) {
        if (threats.find((op) => t.id === op.piece.id)) {
          GameState.pieces[i].proposedPositionWillBeThreatened.set(true);
        } else if (t.proposedPositionWillBeThreatened) {
          GameState.pieces[i].proposedPositionWillBeThreatened.set(false);
        }
      }
    }
    AppState.spinner.set(false);
  }
}

export function proposeDirection(direction: Direction) {
  beginBatch();
  GameState.proposed.assign({
    direction,
  });
  setMoveScale(GameState.proposed.distance.peek());
  endBatch();
}

function applyMove(pieceId: string, position: Position) {
  const raw = GameState.peek();
  const pieceIndex = raw.pieces.findIndex((p) => p.id === pieceId);
  const rawPiece = raw.pieces[pieceIndex];
  const observablePiece = GameState.pieces[pieceIndex];

  const isCastle = rawPiece.type === 'King' && position.squareDistance(rawPiece.position) === 4;
  const isLeft = position.x < rawPiece.position.x;

  observablePiece.assign({
    position,
    history: [...rawPiece.history, rawPiece.position],
  });

  if (rawPiece.type === 'Pawn') {
    GameState.halfMoveCount.set(0);

    // En Passant is if nearest position is 2 away and it's the first pawn move
    if (rawPiece.history.length === 1) {
      const nearest = position.nearestCenter();
      if (nearest.y === 4 || nearest.y === 5) {
        GameState.enPassant.set(
          new Position(position.x, nearest.y === 4 ? position.y - 1 : position.y + 1),
        );
      }
    }

    if ((rawPiece as Pawn).canPromote(raw)) {
      const newQueen = (rawPiece as Pawn).promote(raw);
      GameState.pieces[pieceIndex].set(newQueen);
    }
  }

  let takes: Piece[];
  if (isCastle) {
    takes = [];
    const rookPosition = isLeft ? 0.5 : GameState.size.peek() - 0.5;
    const rookIndex = raw.pieces.findIndex(
      (p) => p.sameTeam(rawPiece) && p.position.x === rookPosition,
    )!;
    const rawRook = raw.pieces[rookIndex];
    GameState.pieces[rookIndex].assign({
      position: rawRook.position.add([isLeft ? 3 : -2, 0]),
      history: [...rawRook.history, rawRook.position],
    });
  } else {
    // I'm not sure why these become pieces and do not remain observables
    takes = raw.pieces.filter(
      (p) =>
        !p.sameTeam(rawPiece) && p.position.overlaps(rawPiece.position, p.radius, rawPiece.radius),
    );

    if (takes?.length) {
      GameState.halfMoveCount.set(0);
      takes.forEach((taken) => {
        const ix = GameState.pieces.findIndex((p) => p.id === taken.id)!;
        const piece = GameState.pieces[ix];
        GameState.dead.push(piece);
        GameState.pieces.splice(ix, 1);
        if (taken.type === 'King') {
          GameState.gameOver.set(true);
        }
      });
    }
  }

  GameState.moveCount.set(raw.moveCount + 1);
  GameState.whiteToMove.set(rawPiece.black);
  return takes;
}

export function applyMoves(moves: GameMove[]) {
  moves.forEach((move) => {
    applyMove(move.p, new Position(...move.to));
  });
}

export async function shareGameId(gameId: string) {
  const url = `https://pyralis.page.link?link=${encodeURIComponent(
    `https://chess.pyralis.com/?id=${gameId}`,
  )}&st=${encodeURIComponent('ε Chess')}&sd=${encodeURIComponent(
    'A game of chess where the pieces can move partial amounts.',
  )}si=${encodeURIComponent('https://chess.pyralis.com/social.png')}`;
  if (Platform.OS === 'web') {
    await Clipboard.setStringAsync(url).then(() => {
      alert('A game link copied to clipboard. Send it to your opponent.');
    });
  } else {
    await Share.share({
      url,
      title: 'Play ε Chess with me!',
    });
  }
}
