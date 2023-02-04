import { Game, status } from 'js-chess-engine';

import { getFen } from './fen';
import { defaultBoard } from '..';
import { getBaseState } from '../../state';
import { RawGameState } from '../../state/types';

describe('Positions', () => {
  it('Should encode the empty board', () => {
    const state: RawGameState = {
      ...getBaseState(),
      pieces: defaultBoard(),
    };
    const fen = getFen(state);
    expect(fen).toEqual('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

    const p1 = state.pieces.find((p) => p.id === 'WPawn5')!;
    p1.position = p1.position.add([0, 2]);
    state.enPassant = p1.position.add([0, -1]);
    state.whiteToMove = false;
    expect(getFen(state)).toEqual('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1');
  });

  it('Should make a move', () => {
    const state: RawGameState = {
      ...getBaseState(),
      pieces: defaultBoard(),
    };
    const g = new Game(status(getFen(state)));
    expect(g).toBeTruthy();
  });
});
