import { getOverlappingPiece } from ".";
import { Pawn } from "../pieces/Pawn";
import { Queen } from "../pieces/Queen";
import { Position } from "../Position";

describe('topology', () => {
  it('should find overlaps', () => {
    const queen = new Queen(false, new Position(0, 0));
    const pawn = new Pawn(false, new Position(4, 4));
    const pawn2 = new Pawn(false, new Position(5, 4));
    const pawn3 = new Pawn(false, new Position(5, 5));
    expect(getOverlappingPiece(queen, new Position(8, 8), [pawn])).toEqual(pawn);
    expect(getOverlappingPiece(queen, new Position(8, 8), [pawn2])).toEqual(undefined);
    expect(getOverlappingPiece(queen, new Position(8, 8), [pawn2, pawn3, pawn])).toEqual(pawn);
  });
});
