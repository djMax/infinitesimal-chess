import { Position } from './Position';

const testCases = [
  { s: [0, 0], e: [0, 8], l: 4, exp: [0, 4] },
  { s: [0, 0], e: [0, 8], l: 10, exp: [0, 8] },
  { s: [0, 8], e: [0, 0], l: 3, exp: [0, 5] },
  { s: [0, 0], e: [8, 6], l: 5, exp: [4, 3] },
  { s: [0, 0], e: [8, 8], l: Math.sqrt(2), exp: [1, 1] },
] as const;

describe('Positions', () => {
  it('Should clamp lines properly', () => {
    testCases.forEach(({ s, e, l, exp }) => {
      const newEnd = Position.maxLength(new Position(s[0], s[1]), new Position(e[0], e[1]), l);
      expect([newEnd?.x, newEnd?.y]).toEqual(exp);
    });
  });
});
