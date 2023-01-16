import { Platform } from 'react-native';
import { configureObservablePersistence, persistObservable } from '@legendapp/state/persist'
import { observable, ObservablePersistenceConfig } from "@legendapp/state"
import { defaultBoard } from "../models";
import { Piece } from "../models/Piece";

const persistLocal = Platform.select<ObservablePersistenceConfig['persistLocal']>({
  default: require('@legendapp/state/persist-plugins/mmkv').ObservablePersistMMKV,
  web: require('@legendapp/state/persist-plugins/local-storage').ObservablePersistLocalStorage,
});

// Global configuration
configureObservablePersistence({ persistLocal });

export const GameState = observable({
  board: defaultBoard(),
  dead: [] as Piece[],
  whiteToMove: true,
});

export const Settings = observable({
  boardSettings: {
    background: 'default',
  },
});

persistObservable(Settings, { local: 'settings' });
