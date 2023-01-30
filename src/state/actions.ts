import { Observable } from '@legendapp/state';

import { GameState, ObservableGameState } from '.';
import { defaultBoard } from '../models';
import { Direction, Piece } from '../models/Piece';
import { getOverlappingPieces } from '../models/topology';

export function resetGame(pieces = defaultBoard(), whiteToMove: boolean = true) {
  GameState.assign({
    pieces,
    dead: [],
    whiteToMove,
    gameOver: false,
  });
}

// Commit the proposed move and update state
export function completeMove(state: ObservableGameState) {
  const raw = state.peek();
  const { pieceId, direction, distance } = raw.proposed;

  const pieceIndex = raw.pieces.findIndex((p) => p.id === pieceId);
  const rawPiece = raw.pieces[pieceIndex];
  const newPos = rawPiece.getScaledMove(raw, direction!, distance);

  const observablePiece = state.pieces[pieceIndex];
  observablePiece.assign({
    position: newPos,
    history: [...observablePiece.history, observablePiece.position],
  });
  state.proposed.assign({
    pieceId: undefined,
    direction: undefined,
    availableDirections: [],
    position: undefined,
    distance: 1,
  });

  // I'm not sure why these become pieces and do not remain observables
  const takes = state.pieces.filter(
    (p) =>
      p.black.get() !== rawPiece.black &&
      p.position.get().squareDistance(rawPiece.position) < (p.radius.get() + rawPiece.radius) ** 2,
  ) as unknown as Piece[];

  if (takes?.length) {
    takes.forEach((taken) => {
      const ix = state.pieces.findIndex((p) => p.id === taken.id)!;
      const piece = state.pieces[ix];
      state.dead.push(piece);
      state.pieces.splice(ix, 1);
      if (taken.type === 'King') {
        state.gameOver.set(true);
      }
    });
  }

  state.pieces.forEach((p) => {
    if (p.canThreaten.peek()) {
      p.canThreaten.set(false);
    }
    if (p.threatened.peek()) {
      p.threatened.set(false);
    }
  });
  state.whiteToMove.set(!state.whiteToMove.get());
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
  });
  const allInvolved = new Set();
  d.forEach((dir) => {
    // Find the overlapping piece for this direction
    const end = piece.getMaximumMove(game, dir);
    const overlap = getOverlappingPieces(piece.peek(), end, game.pieces);
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
}

export function proposeDirection(direction: Direction) {
  GameState.proposed.assign({
    direction,
  });
}

export function setMoveScale(scale: number) {
  const game = GameState.peek();
  const piece = game.pieces.find((p) => p.id === game.proposed.pieceId)!;
  const newPosition = piece.getScaledMove(GameState.peek(), game.proposed.direction!, scale);
  GameState.proposed.assign({
    distance: scale,
    position: newPosition,
  });
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
}