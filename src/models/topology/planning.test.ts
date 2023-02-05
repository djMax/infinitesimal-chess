import { findThreats } from './planning';
import { DemoBoards } from '..';
import { getBaseState } from '../../state';
import { Position } from '../Position';
import { Pawn } from '../pieces/Pawn';

describe('topology', () => {
  it('should see threats', () => {
    const rawState = {
      ...getBaseState(),
      pieces: DemoBoards.NoPawns(),
    };
    const k = rawState.pieces.find((p) => p.type === 'King' && !p.black)!;
    const r = rawState.pieces.find((p) => p.type === 'Rook' && !p.black)!;

    expect(findThreats(rawState, k, k.position).length).toEqual(0);
    expect(findThreats(rawState, r, r.position).length).toEqual(1);
    expect(findThreats(rawState, k, k.position.add([0, 5])).length).toEqual(1);
    expect(findThreats(rawState, k, k.position.add([0, 6])).length).toEqual(4);

    const bpawn = new Pawn(true, new Position(0.5, 6.5));
    rawState.pieces.push(bpawn);
    expect(findThreats(rawState, r, r.position).length).toEqual(0);
    expect(findThreats(rawState, r, bpawn.position).length).toEqual(2);
    expect(findThreats(rawState, r, bpawn.position.add([0, -1])).length).toEqual(2);
    expect(findThreats(rawState, r, bpawn.position.add([0, -0.3])).length).toEqual(3);
  });
});
