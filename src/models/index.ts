import { Piece } from './Piece';
import { Position } from './Position';
import { Bishop } from './pieces/Bishop';
import { King } from './pieces/King';
import { Knight } from './pieces/Knight';
import { Pawn } from './pieces/Pawn';
import { Queen } from './pieces/Queen';
import { Rook } from './pieces/Rook';

function p(x: number, y: number): Position {
  return new Position(x + 0.5, y + 0.5);
}

export function defaultBoard() {
  return [
    new King(true, p(4, 7)),
    new Queen(true, p(3, 7)),
    new Rook(true, p(0, 7)),
    new Rook(true, p(7, 7)),
    new Knight(true, p(1, 7)),
    new Knight(true, p(6, 7)),
    new Bishop(true, p(2, 7)),
    new Bishop(true, p(5, 7)),
    ...Array(8)
      .fill(0)
      .map((_, i) => new Pawn(true, p(i, 6))),
    new King(false, p(4, 0)),
    new Queen(false, p(3, 0)),
    new Rook(false, p(0, 0)),
    new Rook(false, p(7, 0)),
    new Knight(false, p(1, 0)),
    new Knight(false, p(6, 0)),
    new Bishop(false, p(2, 0)),
    new Bishop(false, p(5, 0)),
    ...Array(8)
      .fill(0)
      .map((_, i) => new Pawn(false, p(i, 1))),
  ];
}

function move(p: Piece, deltaX: number, deltaY: number) {
  p.history.push(p.position);
  const dy = p.black ? -deltaY : deltaY;
  p.position = new Position(p.position.x + deltaX, p.position.y + dy);
}

export const DemoBoards = {
  SimplePawnDevelopment() {
    const wPawns = Array(8)
      .fill(0)
      .map((_, i) => new Pawn(false, p(i, 1)));
    const bPawns = Array(8)
      .fill(0)
      .map((_, i) => new Pawn(true, p(i, 6)));

    move(wPawns[4], 0, 2);
    move(bPawns[4], 0, 2);
    move(wPawns[3], 0, 1);
    move(bPawns[5], 0, 1);
    move(wPawns[2], 0, 2);
    move(bPawns[0], 0, 2);
    move(wPawns[0], 0, 2);

    return [
      new King(true, p(4, 7)),
      new Queen(true, p(3, 7)),
      new Rook(true, p(0, 7)),
      new Rook(true, p(7, 7)),
      new Knight(true, p(1, 7)),
      new Knight(true, p(6, 7)),
      new Bishop(true, p(2, 7)),
      new Bishop(true, p(5, 7)),
      ...bPawns,
      new King(false, p(4, 0)),
      new Queen(false, p(3, 0)),
      new Rook(false, p(0, 0)),
      new Rook(false, p(7, 0)),
      new Knight(false, p(1, 0)),
      new Knight(false, p(6, 0)),
      new Bishop(false, p(2, 0)),
      new Bishop(false, p(5, 0)),
      ...wPawns,
    ];
  },
  DoubleCapture() {
    return [
      new King(true, p(4, 7)),
      new Bishop(true, p(4, 4)),
      new Bishop(true, p(5, 4)),
      new King(false, p(4, 0)),
      new Rook(false, p(4.5, 2)),
    ];
  },
  QueenInstamate() {
    return [
      new King(true, p(4, 7)),
      ...Array(4)
        .fill(0)
        .map((_, i) => new Pawn(true, p(i * 2, 1))),
      new King(false, p(1, 0)),
      new Queen(false, p(4, 0)),
      ...Array(4)
        .fill(0)
        .map((_, i) => new Pawn(false, p(i * 2, 6))),
    ];
  },
  BackRank() {
    return [
      new King(true, p(4, 7)),
      ...Array(8)
        .fill(0)
        .map((_, i) => new Pawn(true, p(i, 6))),
      new King(false, p(4, 0)),
      new Queen(false, p(7, 7)),
    ];
  },
  NoPawns() {
    return defaultBoard().filter((p) => !(p instanceof Pawn));
  },
  OnePawn() {
    return [
      ...defaultBoard().filter((p) => !(p instanceof Pawn)),
      new Pawn(true, new Position(0.5, 6.5)),
    ];
  },
  Castle() {
    return defaultBoard().filter(
      (p) => ['King', 'Rook'].includes(p.type) || p.id === 'BBishop3' || p.id === 'WBishop6',
    );
  },
} as const;
