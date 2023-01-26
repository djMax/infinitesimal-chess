import { Platform } from 'react-native';
import { configureObservablePersistence, persistObservable } from '@legendapp/state/persist'
import { observable, ObservablePersistenceConfig } from "@legendapp/state"
import { defaultBoard } from "../models";
import { Direction, Piece } from "../models/Piece";

const persistLocal = Platform.select<ObservablePersistenceConfig['persistLocal']>({
  default: require('@legendapp/state/persist-plugins/mmkv').ObservablePersistMMKV,
  web: require('@legendapp/state/persist-plugins/local-storage').ObservablePersistLocalStorage,
});

// Global configuration
configureObservablePersistence({ persistLocal });

export const GameState = observable({
  board: defaultBoard(),
  proposed: {
    piece: undefined as (Piece | undefined),
    direction: undefined as (Direction | undefined),
    distance: 1,
  },
  dead: [] as Piece[],
  whiteToMove: true,
});

export const GameSettings = observable({
  boardSettings: {
    background: 'default',
    halo: true,
  },
});

persistObservable(GameSettings, { local: 'settings' });
