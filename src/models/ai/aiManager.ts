import { AiLevel, Game, status } from 'js-chess-engine';

import { GameMove, RawGameState } from '../../state/types';
import { Piece } from '../Piece';
import { Knight } from '../pieces/Knight';
import { Position } from '../Position';

let currentGame: Game;
let level: AiLevel;

export function initializeAi(level: number, fen: string) {
  currentGame = new Game(status(fen));
}

function getDirection(p: Piece, from: Position, to: Position) {
  if (p.type === 'Knight') {
    return Knight.getKnightMove(from, to)!;
  }
  return [Position.getDirection(from, to), undefined];
}

export function getAiMove(state: RawGameState): GameMove {
  // TODO see if we can take the king. If so, do it.
  const move = currentGame.aiMove(level);
  const [from, to] = Object.entries(move)[0];
  const fromPos = Position.fromChessPosition(from);
  const toPos = Position.fromChessPosition(to);

  console.log('Raw AI Move', move, fromPos, toPos);
  const at = state.pieces.find((p) => p.position.nearestCenter().equals(fromPos))!;
  const [direction, variant] = getDirection(at, fromPos, toPos);
  console.log('PIECE', at, direction, variant);
  return {
    id: String(state.moveCount),
    p: at!.id,
    d: direction!,
    v: variant,
    to: [toPos.x + 0.5, toPos.y + 0.5],
    t: Date.now(),
  };
}

export function applyMoveToAi(state: RawGameState, move: GameMove) {
  const piece = state.pieces.find((p) => p.id === move.p)!;
  console.log('Piece', move.p, piece.history, move.to);
  const from = piece.history[piece.history.length - 1].toChessPosition();
  const to = new Position(...move.to).nearestCenter().toChessPosition();
  console.log('Apply move', from, to);
  currentGame.move(from, to);
}
