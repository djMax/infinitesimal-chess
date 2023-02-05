// Convert our board into Forsyth–Edwards Notation to allow simplistic AIs
// https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation

import { canCastle } from '../../state/castle';
import { RawGameState } from '../../state/types';
import { PieceType } from '../types';

const TypeToNameMap: Record<PieceType, string> = {
  Pawn: 'p',
  Knight: 'n',
  Bishop: 'b',
  Rook: 'r',
  Queen: 'q',
  King: 'k',
};

function isNum(x: string) {
  return !Number.isNaN(Number(x));
}

// Six fields
// 1 piece data
// 2 who's turn (w,b)
// 3 can castle (K white kingside, Q white queenside, k black kingside, q black queenside, - none)
// 4 en passant (- for none)
// 5 half move clock
// 6 full move number, starting at 1
export function getFen(gameState: RawGameState): string {
  const occupants: string[][] = Array(8)
    .fill(0)
    .map(() => Array(8).fill(''));
  gameState.pieces.forEach((piece) => {
    const pos = piece.position.nearestCenter();
    const fenName = TypeToNameMap[piece.type];
    occupants[7 - pos.y][pos.x] = piece.black ? fenName.toLowerCase() : fenName.toUpperCase();
  });
  const f1 = occupants
    .map((row) =>
      row.reduce((acc, cur) => {
        if (cur) {
          return `${acc}${cur}`;
        }
        if (!acc || !isNum(acc[acc.length - 1])) {
          return `${acc}1`;
        }
        return `${acc.slice(0, -1)}${Number(acc[acc.length - 1]) + 1}`;
      }, ''),
    )
    .join('/');
  const castle = [
    canCastle(gameState, false, true) ? 'K' : '',
    canCastle(gameState, false, false) ? 'Q' : '',
    canCastle(gameState, true, true) ? 'k' : '',
    canCastle(gameState, true, false) ? 'q' : '',
  ].join('');
  return [
    f1,
    gameState.whiteToMove ? 'w' : 'b',
    castle,
    gameState.enPassant ? gameState.enPassant.toChessPosition() : '-',
    gameState.halfMoveCount,
    Math.floor(gameState.moveCount / 2) + 1,
  ].join(' ');
}
