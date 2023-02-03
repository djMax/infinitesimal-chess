import { Observable } from '@legendapp/state';

import { getBaseState, GameState, ObservableGameState } from '.';
import { GameMove } from './types';
import { assignRemoteDb } from '../adapters/firebase';
import { defaultBoard } from '../models';
import { Direction, Piece } from '../models/Piece';
import { Position } from '../models/Position';
import { Knight } from '../models/pieces/Knight';
import { getOverlappingPieces } from '../models/topology';

export function resetGame(pieces = defaultBoard(), whiteToMove: boolean = true) {
  GameState.assign({
    ...getBaseState(),
    pieces,
  });
}

// Commit the proposed move and update state
export function completeMove(state: ObservableGameState) {
  const raw = state.peek();
  const { pieceId, direction, distance, variant } = raw.proposed;

  const pieceIndex = raw.pieces.findIndex((p) => p.id === pieceId);
  const rawPiece = raw.pieces[pieceIndex];
  const newPos = rawPiece.getScaledMove(raw, direction!, distance, variant);

  if (raw.multiplayer.gameId) {
    const moveId = raw.multiplayer.moveCount;
    const move: GameMove = {
      id: String(moveId),
      p: pieceId!,
      d: direction!,
      to: [newPos.x, newPos.y],
      t: Date.now(),
    };
    // TODO handle errors.
    assignRemoteDb(`games/${raw.multiplayer.gameId}/moves/${move.id}`, move);
    console.log('Set move count', raw.multiplayer.moveCount + 1);
    state.multiplayer.moveCount.set(moveId + 1);
  }

  state.proposed.assign({
    pieceId: undefined,
    direction: undefined,
    availableDirections: [],
    position: undefined,
    distance: 1,
  });

  applyMove(pieceId!, newPos);

  state.pieces.forEach((p) => {
    if (p.canThreaten.peek()) {
      p.canThreaten.set(false);
    }
    if (p.threatened.peek()) {
      p.threatened.set(false);
    }
  });
}

export function proposePiece(piece: Observable<Piece>) {
  const game = GameState.peek();
  if (game.whiteToMove === piece.black.get() || piece.id.get() === game.proposed.pieceId) {
    return;
  }
  const d = piece.availableDirections(game);
  GameState.proposed.assign({
    pieceId: piece.id.get(),
    direction: d.length === 1 ? d[0] : undefined,
    availableDirections: d,
    distance: 0,
    position: piece.position.get(),
    variant: piece.moveVariants[0],
  });
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
      if (overlap?.pieces && overlap.pieces[0].black !== piece.black.get()) {
        overlap.pieces.forEach((p) => allInvolved.add(p.id));
      }
    });
    GameState.pieces.forEach((p) => {
      const canThreaten = p.canThreaten.peek();
      const nowCanThreaten = allInvolved.has(p.id.peek());
      if (canThreaten && !nowCanThreaten) {
        p.canThreaten.set(false);
      } else if (!canThreaten && nowCanThreaten) {
        p.canThreaten.set(true);
      }
    });
  });
}

export function setMoveScale(scale: number) {
  const game = GameState.peek();
  const piece = game.pieces.find((p) => p.id === game.proposed.pieceId)!;
  const newPosition = piece.getScaledMove(
    GameState.peek(),
    game.proposed.direction!,
    scale,
    game.proposed.variant,
  );
  GameState.proposed.assign({
    distance: scale,
    position: newPosition,
    valid: piece.isValid(game, newPosition),
  });
  requestAnimationFrame(() => {
    for (let i = 0; i < game.pieces.length; i += 1) {
      const t = game.pieces[i];
      if (t.canThreaten) {
        const distance = t.position.squareDistance(newPosition);
        const isThreatened = distance < (t.radius + piece.radius) ** 2;
        if (isThreatened !== t.threatened) {
          GameState.pieces[i].threatened.set(isThreatened);
        }
      }
    }
  });
}

export function proposeDirection(direction: Direction) {
  GameState.proposed.assign({
    direction,
  });
  setMoveScale(GameState.proposed.distance.peek());
}

function applyMove(pieceId: string, position: Position) {
  const raw = GameState.peek();
  const pieceIndex = raw.pieces.findIndex((p) => p.id === pieceId);
  const rawPiece = raw.pieces[pieceIndex];
  const observablePiece = GameState.pieces[pieceIndex];
  observablePiece.assign({
    position,
    history: [...observablePiece.history, observablePiece.position],
  });

  // I'm not sure why these become pieces and do not remain observables
  const takes = GameState.pieces.filter(
    (p) =>
      p.black.get() !== rawPiece.black &&
      p.position.overlaps(rawPiece.position, p.radius.get(), rawPiece.radius),
  ) as unknown as Piece[];

  if (takes?.length) {
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
  GameState.whiteToMove.set(rawPiece.black);
}

export function applyMoves(moves: GameMove[]) {
  moves.forEach((move) => {
    applyMove(move.p, new Position(...move.to));
  });
}
