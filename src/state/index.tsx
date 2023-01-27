import { observable, ObservablePersistenceConfig } from '@legendapp/state';
import { configureObservablePersistence, persistObservable } from '@legendapp/state/persist';
import { Platform } from 'react-native';

import { defaultBoard } from '../models';
import { Direction, Piece } from '../models/Piece';

const persistLocal = Platform.select<ObservablePersistenceConfig['persistLocal']>({
  default: require('@legendapp/state/persist-plugins/mmkv').ObservablePersistMMKV,
  web: require('@legendapp/state/persist-plugins/local-storage').ObservablePersistLocalStorage,
});

// Global configuration
configureObservablePersistence({ persistLocal });

export const GameState = observable({
  board: defaultBoard(),
  proposed: {
    piece: undefined as Piece | undefined,
    direction: undefined as Direction | undefined,
    threatened: undefined as Piece | undefined,
    distance: 1,
  },
  dead: [] as Piece[],
  whiteToMove: true,
  gameOver: false,
  size: 8,
});

export function getAllPieces() {
  return [...GameState.board.white, ...GameState.board.black];
}

export const GameSettings = observable({
  boardSettings: {
    background: 'default',
    halo: true,
  },
});

export function resetGame(board = defaultBoard(), whiteToMove: boolean = true) {
  GameState.assign({
    board,
    dead: [],
    whiteToMove,
    gameOver: false,
  });
}

export type GameState = typeof GameState;

persistObservable(GameSettings, { local: 'settings' });

// Commit the proposed move and update state
export function completeMove(state: GameState) {
  const proposed = state.proposed.piece.get()!;
  const dir = state.proposed.direction.get()!;
  const dist = state.proposed.distance.get();

  const newPos = proposed.getScaledMove(state, dir, dist);
  state.proposed.piece.assign({
    position: newPos,
    history: [...proposed.history, proposed.position],
  });
  state.proposed.assign({
    piece: undefined,
    direction: undefined,
    threatened: undefined,
    distance: 1,
  });

  const candidates = proposed.black ? state.board.white : state.board.black;
  // I'm not sure why these become pieces and do not remain observables
  const takes = candidates.filter(
    (p) =>
      p.position.get().squareDistance(proposed.position) < (p.radius.get() + proposed.radius) ** 2,
  ) as unknown as Piece[];

  if (takes?.length) {
    takes.forEach((taken) => {
      const target = state.board[proposed.black ? 'white' : 'black'];
      const piece = target.find((p) => p.id === taken.id)!;
      state.dead.push(piece);
      target.splice(target.indexOf(piece), 1);
      if (taken.type === 'King') {
        state.gameOver.set(true);
      }
    });
  }

  state.whiteToMove.set(!state.whiteToMove.get());
}
