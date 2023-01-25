import { Position } from "../Position";
import { Piece } from '../Piece';
import { Pawn } from "./Pawn";

const testCases = [
  { from: [0.5, 1.5], direction: 'N', expected: '0.5, 7.5' },
  { from: [0.5, 1.5], direction: 'S', expected: '0.5, 0.5' },
  { from: [0.5, 1.5], direction: 'E', expected: '7.5, 1.5' },
  { from: [0.5, 1.5], direction: 'W', expected: '0.5, 1.5' },
  { from: [4, 4], direction: 'NE', expected: '7.5, 7.5' },
  { from: [4, 4], direction: 'SE', expected: '7.5, 0.5' },
  { from: [4, 5], direction: 'SE', expected: '7.5, 1.5' },
  { from: [4, 4], direction: 'SW', expected: '0.5, 0.5' },
  { from: [0.5, 5.5], direction: 'NE', expected: '2.5, 7.5' },
  { from: [0.5, 6.5], direction: 'SE', expected: '6.5, 0.5' },
] as const;

describe('Pieces', () => {
   it('Pawns should move properly', () => {
     const bp = new Pawn(true, new Position(0.5, 6.5), 0.5);
     expect(bp.availableDirections().sort()).toEqual(['S', 'SE', 'SW']);
     expect(bp.getMaximumMove('SE', 8).toString()).toEqual("1.5, 5.5");

     const wp = new Pawn(false, new Position(0.5, 1.5));
     expect(wp.availableDirections().sort()).toEqual(['N', 'NE', 'NW']);
     // expect(wp.getMaximumMove('SE', 8).toString()).toEqual("1.5, 5.5");
});

  testCases.forEach(({ from, direction, expected }, ix) => {
    it(`Movement test case ${ix}`, () => {
      const p = new Piece(true, 'Queen', new Position(from[0], from[1]), 0.5);
      const np = p.getMaximumMove(direction, 8);
      expect(np.toString()).toEqual(expected);
    });
  });
});
