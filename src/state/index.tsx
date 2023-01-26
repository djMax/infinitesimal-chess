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
    threatened: undefined as (Piece | undefined),
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

export function resetGame() {
  GameState.assign({
    board: defaultBoard(),
    dead: [],
    whiteToMove: true,
    gameOver: false,
  });
}

export type GameState = typeof GameState;

persistObservable(GameSettings, { local: 'settings' });

function findTakenPiece(piece: Piece) {
  const candidates = piece.black ? GameState.board.white : GameState.board.black;
  return candidates.filter((p) => p.position.get().squareDistance(piece.position) < (p.radius.get() + piece.radius) ** 2);
}

// Commit the proposed move and update state
export function completeMove() {
  const proposed = GameState.proposed.piece.get()!;
  const dir = GameState.proposed.direction.get()!;
  const dist = GameState.proposed.distance.get();

  const newPos = proposed.getScaledMove(GameState, dir, dist);
  GameState.proposed.piece.assign({ position: newPos, history: [...proposed.history, newPos] });
  GameState.proposed.assign({ piece: undefined, direction: undefined, threatened: undefined, distance: 1 });

  const takes = findTakenPiece(proposed);
  if (takes?.length) {
    takes.forEach((taken) => {
      const target = GameState.board[proposed.black ? 'white' : 'black'];
      const piece = target.find((p) => p.id === taken.id)!;
      GameState.dead.push(piece);
      target.splice(target.indexOf(piece), 1);
      if (taken.type === 'King') {
        GameState.gameOver.set(true);
      }
    });
  }

  GameState.whiteToMove.set(!GameState.whiteToMove.get());
}
