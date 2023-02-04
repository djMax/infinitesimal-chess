import { Pawn } from './Pawn';
import { GameState } from '../../state';
import { Piece } from '../Piece';
import { Position } from '../Position';
import { Knight } from './Knight';

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
    expect(bp.availableDirections(GameState.get()).sort()).toEqual(['S']);
    expect(bp.getMaximumMove(GameState.get(), 'SE').toString()).toEqual('1.5, 5.5');

    const wp = new Pawn(false, new Position(0.5, 1.5));
    expect(wp.availableDirections(GameState.get()).sort()).toEqual(['N']);
    // expect(wp.getMaximumMove('SE', 8).toString()).toEqual("1.5, 5.5");
  });

  testCases.forEach(({ from, direction, expected }, ix) => {
    it(`Movement test case ${ix}`, () => {
      const p = new Piece(true, 'Queen', new Position(from[0], from[1]), 0.5);
      const np = p.getMaximumMove(GameState.get(), direction);
      expect(np.toString()).toEqual(expected);
    });
  });

  it('Knight should be able to figure itself out', () => {
    const p = new Knight(true, new Position(4.5, 4.5));
    p.availableDirections(GameState.get()).forEach((dir) => {
      const np = p.getMaximumMove(GameState.get(), dir);
      expect(Knight.getKnightMove(p.position, np)?.[0]).toEqual(dir);
    });
  });
});
