import { Platform } from 'react-native';
import uuid from 'react-native-uuid';

import { RemoteConfigs } from './default-config';
import { assignRemoteDb, getDbAndNotify, internalGetRemoteConfig, setRemoteDb } from './firebase';
import { GameSettings, GameState } from '../state';
import { applyMoves, resetGame } from '../state/actions';
import { FirebaseGameDocument, GameMove } from '../state/types';

export function getRemoteConfiguration<T extends keyof RemoteConfigs, R>(
  key: T,
  type: 'string' | 'boolean' | 'number',
): R {
  const config = internalGetRemoteConfig(key);
  switch (type) {
    case 'string':
      return config.asString() as R;
    case 'boolean':
      return config.asBoolean() as R;
    case 'number':
      return config.asNumber() as R;
  }
}

export async function createGame(isWhite: boolean) {
  const gameId = String(uuid.v4());
  await setRemoteDb(`games/${gameId}`, {
    start: Date.now(),
    [isWhite ? 'white' : 'black']: GameSettings.playerId.get(),
  });
  if (Platform.OS === 'web') {
    window.history.replaceState(null, 'Multiplayer Game', `/?id=${gameId}`);
  }
  return gameId;
}

function becomePlayer(ref: string, game: FirebaseGameDocument) {
  const playerId = GameSettings.playerId.peek();
  if (!game.white) {
    game.white = playerId;
    assignRemoteDb(ref, { white: playerId });
  }
  if (!game.black) {
    game.black = playerId;
    assignRemoteDb(ref, { black: playerId });
  }
}

function toArray(r: FirebaseGameDocument['moves']) {
  const entries = Object.entries(r);
  const moves: GameMove[] = [];
  entries.forEach(([ix, move]) => {
    moves[Number(ix)] = { id: ix, ...move };
  });
  return moves;
}

export async function joinGame(gameId: string): Promise<() => void> {
  let gotEvent = false;

  const ref = `games/${gameId}`;
  return getDbAndNotify(ref, (game: FirebaseGameDocument) => {
    if (!gotEvent) {
      gotEvent = true;
      /*
      const ex = GameList.games.findIndex((p) => p.id === gameId);
      const name = ex >= 0 ? GameList.games[ex].name.get() : undefined;
      if (ex >= 0) {
        GameList.games.splice(ex, 1);
      }
      */

      becomePlayer(ref, game);
      /*
      GameList.games.unshift({
        id: gameId,
        name: name || new Date(game.start).toLocaleDateString(),
        white: game.white!,
        black: game.black!,
        over: game.over || false,
        moves: [],
      });
      */

      resetGame();
      const moveArray = game.moves ? toArray(game.moves) : [];
      GameState.multiplayer.assign({
        gameId,
        isWhite: game.white === GameSettings.playerId.peek(),
        moveCount: moveArray.length,
      });
      if (moveArray.length) {
        applyMoves(moveArray);
      }
    }
    const expectedMove = GameState.multiplayer.moveCount.peek();
    if (game.moves?.[expectedMove]) {
      const m = game.moves[expectedMove];
      const p = GameState.pieces.peek().find((p) => p.id === m.pieceId);
      // Only process opponent move updates
      if (p!.black === GameState.multiplayer.isWhite.peek()) {
        applyMoves([{ ...game.moves[expectedMove], id: String(expectedMove) }]);
        GameState.multiplayer.moveCount.set(expectedMove + 1);
      }
    }
    return true;
  });
}
