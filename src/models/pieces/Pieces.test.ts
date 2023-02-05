import { Knight } from './Knight';
import { Pawn } from './Pawn';
import { GameState, getBaseState } from '../../state';
import { Piece } from '../Piece';
import { Position } from '../Position';
import { defaultBoard, DemoBoards } from '..';

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

  it('Should be able to tell when things will be taken', () => {
    const p = DemoBoards.NoPawns();
    const k = p.find((p) => p.type === 'King' && !p.black)!;
    const r = p.find((p) => p.type === 'Rook' && !p.black)!;
    const state = {
      ...getBaseState(),
      pieces: p,
    };
    // expect(k.canBeTaken(state, k.position).length).toEqual(0);
    // expect(r.canBeTaken(state, r.position).length).toEqual(1);
    // expect(k.canBeTaken(state, k.position.add([0, 5])).length).toEqual(1);
    expect(k.canBeTaken(state, k.position.add([0, 6])).length).toEqual(4);
  });
});
