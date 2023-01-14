import { Position } from "../Position";
import { Pawn } from "./Pawn";

describe('Pieces', () => {
  it('Pawns should move properly', () => {
    const pawn = new Pawn(true, new Position(0.5, 1.5));
    expect(pawn.availableDirections()).toEqual(['S']);
  });
});
