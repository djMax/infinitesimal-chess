import { observable } from '@legendapp/state';
import { persistObservable } from '@legendapp/state/persist';
import uuid from 'react-native-uuid';

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
    multiplayer: {
      gameId: undefined as string | undefined,
      isWhite: true,
    },
  } as RawGameState);

export const GameState = observable<RawGameState>({ ...getBaseState() });

export const GameSettings = observable({
  boardSettings: {
    background: 'default',
    halo: true,
  },
  playerId: undefined as string | undefined,
});

export type ObservableGameState = typeof GameState;

persistObservable(GameSettings, { local: 'settings' });

if (!GameSettings.playerId.get()) {
  GameSettings.playerId.set(String(uuid.v4()));
}
