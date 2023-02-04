import { AiLevel, Game, status } from 'js-chess-engine';

import { getFen } from './fen';
import { GameMove, RawGameState } from '../../state/types';
import { Piece } from '../Piece';
import { Position } from '../Position';
import { Knight } from '../pieces/Knight';

let currentGame: Game;
let level: AiLevel;

if (__DEV__) {
  let line = '';
  (process as any).stdout = {
    write(s: string) {
      line += s;
      if (s.endsWith('\n')) {
        console.log(line);
        line = '';
      }
      return true;
    },
  };
}

export function initializeAi(level: number, fen: string) {
  currentGame = new Game(status(fen));
}

function getDirection(p: Piece, from: Position, to: Position) {
  if (p.type === 'Knight') {
    return Knight.getKnightMove(from, to)!;
  }
  return [Position.getDirection(from, to), undefined];
}

function getAiMoveForEngine(game: Game, level: AiLevel, state: RawGameState): GameMove {
  // TODO see if we can take the king. If so, do it.
  const move = game.aiMove(level);
  const [from, to] = Object.entries(move)[0];
  const fromPos = Position.fromChessPosition(from);
  const toPos = Position.fromChessPosition(to);

  console.log('Raw AI Move', move, fromPos, toPos);
  if (__DEV__) {
    game.printToConsole();
  }
  const at = state.pieces.find((p) => p.position.nearestCenter().equals(fromPos))!;
  const [direction, variant] = getDirection(at, fromPos, toPos);
  return {
    id: String(state.moveCount),
    p: at!.id,
    d: direction!,
    v: variant,
    to: [toPos.x + 0.5, toPos.y + 0.5],
    t: Date.now(),
  };
}

export function suggestMove(state: RawGameState, level: AiLevel) {
  const game = new Game(status(getFen(state)));
  return getAiMoveForEngine(game, level, state);
}

export function getAiMove(state: RawGameState): GameMove {
  return getAiMoveForEngine(currentGame, level, state);
}

export function applyMoveToAi(state: RawGameState, move: GameMove, takes: Piece[]) {
  const piece = state.pieces.find((p) => p.id === move.p)!;
  const from = piece.history[piece.history.length - 1].toChessPosition();
  const to = new Position(...move.to).nearestCenter().toChessPosition();
  if (takes?.length) {
    takes.forEach((t) => {
      // Only remove the piece manually if we won't occupy the same position
      // (i.e. a double capture)
      if (t.position.nearestCenter().toChessPosition() !== to) {
        currentGame.removePiece(t.position.nearestCenter().toChessPosition());
      }
    });
  }
  currentGame.move(from, to);
  if (__DEV__) {
    currentGame.printToConsole();
  }
}
