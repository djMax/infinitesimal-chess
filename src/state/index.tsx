import { observable, ObservablePersistenceConfig } from '@legendapp/state';
import { configureObservablePersistence, persistObservable } from '@legendapp/state/persist';
import { Platform } from 'react-native';

import { RawGameState } from './types';
import { Direction, Piece } from '../models/Piece';
import { Position } from '../models/Position';

const persistLocal = Platform.select<ObservablePersistenceConfig['persistLocal']>({
  default: require('@legendapp/state/persist-plugins/mmkv').ObservablePersistMMKV,
  web: require('@legendapp/state/persist-plugins/local-storage').ObservablePersistLocalStorage,
});

// Global configuration
configureObservablePersistence({ persistLocal });

export const baseState: RawGameState = {
  pieces: [] as Piece[],
  proposed: {
    pieceId: undefined as string | undefined,
    direction: undefined as Direction | undefined,
    availableDirections: [] as Direction[],
    distance: 1,
    position: undefined as Position | undefined,
  },
  dead: [] as Piece[],
  whiteToMove: true,
  gameOver: false,
  size: 8,
};

export const GameState = observable<RawGameState>({ ...baseState });

export const GameSettings = observable({
  boardSettings: {
    background: 'default',
    halo: true,
  },
});

export type ObservableGameState = typeof GameState;

persistObservable(GameSettings, { local: 'settings' });
