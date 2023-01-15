import { Position } from "../Position";
import { Pawn } from "./Pawn";

describe('Pieces', () => {
  it('Pawns should move properly', () => {
    const bp = new Pawn(true, new Position(0.5, 1.5));
    expect(bp.availableDirections()).toEqual(['S']);

    const wp = new Pawn(false, new Position(0.5, 1.5));
    expect(wp.availableDirections()).toEqual(['N']);
  });
});
