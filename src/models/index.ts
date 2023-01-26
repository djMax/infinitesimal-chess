import { Piece } from "./Piece";
import { Bishop } from "./pieces/Bishop";
import { King } from "./pieces/King";
import { Knight } from "./pieces/Knight";
import { Pawn } from "./pieces/Pawn";
import { Queen } from "./pieces/Queen";
import { Rook } from "./pieces/Rook";
import { Position } from "./Position";

interface Pieces {
  black: Piece[],
  white: Piece[],
}

function p(x: number, y: number): Position {
  return new Position(x + 0.5, y + 0.5);
}

export function defaultBoard(): Pieces {
  return {
    black: [
      new King(true, p(4, 7)),
      new Queen(true, p(3, 7)),
      new Rook(true, p(0, 7)),
      new Rook(true, p(7, 7)),
      new Knight(true, p(1, 7)),
      new Knight(true, p(6, 7)),
      new Bishop(true, p(2, 7)),
      new Bishop(true, p(5, 7)),
      ...Array(8).fill(0).map((_, i) => new Pawn(true, p(i, 6))),
    ],
    white: [
      new King(false, p(4, 0)),
      new Queen(false, p(3, 0)),
      new Rook(false, p(0, 0)),
      new Rook(false, p(7, 0)),
      new Knight(false, p(1, 0)),
      new Knight(false, p(6, 0)),
      new Bishop(false, p(2, 0)),
      new Bishop(false, p(5, 0)),
      ...Array(8).fill(0).map((_, i) => new Pawn(false, p(i, 1))),
    ],
  };
}
