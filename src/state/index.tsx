import { observable } from '@legendapp/state';
import { persistObservable } from '@legendapp/state/persist';
import uuid from 'react-native-uuid';

import { configurePersistenceLayer } from './persist';
import { GameHistory, RawGameState } from './types';
import { PieceSetName } from '../components/PieceImage';
import { Piece } from '../models/Piece';
import { Position } from '../models/Position';
import { Direction } from '../models/types';

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
    moveCount: 0,
    halfMoveCount: 0,
    enPassant: undefined,
    multiplayer: {
      gameId: undefined,
      isWhite: true,
      opponentName: undefined,
    },
  }) as RawGameState;

export const GameState = observable<RawGameState>({ ...getBaseState() });

export const AppState = observable({
  spinner: false,
});

export const GameSettings = observable({
  boardSettings: {
    background: 'default',
    halo: true,
  },
  nickname: undefined as string | undefined,
  playerId: undefined as string | undefined,
  pieceSet: 'Standard' as PieceSetName,
});

export type ObservableGameState = typeof GameState;

persistObservable(GameSettings, { local: 'settings' });

if (!GameSettings.playerId.get()) {
  GameSettings.playerId.set(String(uuid.v4()));
}

export const GameList = observable({
  games: [] as GameHistory[],
});

persistObservable(GameList, { local: 'games' });
