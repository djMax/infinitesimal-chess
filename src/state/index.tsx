import { observable } from '@legendapp/state';
import { persistObservable } from '@legendapp/state/persist';

import { configurePersistenceLayer } from './persist';
import { RawGameState } from './types';
import { Direction, Piece } from '../models/Piece';
import { Position } from '../models/Position';

configurePersistenceLayer();

export const getBaseState = () =>
  ({
    pieces: [] as Piece[],
    proposed: {
      pieceId: undefined as string | undefined,
      direction: undefined as Direction | undefined,
      availableDirections: [] as Direction[],
      distance: 1,
      position: undefined as Position | undefined,
      valid: true,
      variant: undefined,
    },
    dead: [] as Piece[],
    whiteToMove: true,
    gameOver: false,
    size: 8,
  } as RawGameState);

export const GameState = observable<RawGameState>({ ...getBaseState() });

export const GameSettings = observable({
  boardSettings: {
    background: 'default',
    halo: true,
  },
});

export type ObservableGameState = typeof GameState;

persistObservable(GameSettings, { local: 'settings' });
