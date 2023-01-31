import { observable, ObservablePersistenceConfig } from '@legendapp/state';
import { configureObservablePersistence, persistObservable } from '@legendapp/state/persist';
import { Platform } from 'react-native';

import { RawGameState } from './types';
import { Direction, Piece } from '../models/Piece';
import { Position } from '../models/Position';

function getPersistenceLayer(): ObservablePersistenceConfig['persistLocal'] {
  if (Platform.OS === 'web') {
    return require('@legendapp/state/persist-plugins/local-storage').ObservablePersistLocalStorage;
  }
  return require('@legendapp/state/persist-plugins/mmkv').ObservablePersistMMKV;
}

const persistLocal = getPersistenceLayer();

// Global configuration
configureObservablePersistence({ persistLocal });

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
