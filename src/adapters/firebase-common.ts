import { Platform } from 'react-native';
import uuid from 'react-native-uuid';

import { RemoteConfigs } from './default-config';
import { assignRemoteDb, getDbAndNotify, internalGetRemoteConfig, setRemoteDb } from './firebase';
import { GameSettings, GameState } from '../state';
import { applyMoves, resetGame } from '../state/actions';
import { FirebaseGameDocument, GameMove } from '../state/types';

export function getRemoteConfiguration<R>(
  key: keyof RemoteConfigs,
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

export async function createGame(nickname: string, isWhite: boolean) {
  const gameId = String(uuid.v4());
  await setRemoteDb(`games/${gameId}`, {
    s: Date.now(),
    [isWhite ? 'wn' : 'bn']: nickname,
    [isWhite ? 'w' : 'b']: GameSettings.playerId.get(),
  });
  if (Platform.OS === 'web') {
    window.history.replaceState(null, 'Multiplayer Game', `/?id=${gameId}&nick=${nickname}`);
  }
  return gameId;
}

function becomePlayer(ref: string, nick: string, game: FirebaseGameDocument) {
  const playerId = GameSettings.playerId.peek();
  if (!game.w) {
    const update = { w: playerId, wn: nick };
    Object.assign(game, update);
    assignRemoteDb(ref, update);
  }
  if (!game.b) {
    const update = { b: playerId, bn: nick };
    Object.assign(game, update);
    assignRemoteDb(ref, update);
  }
}

function toArray(r: FirebaseGameDocument['m']) {
  const entries = Object.entries(r);
  const moves: GameMove[] = [];
  entries.forEach(([ix, move]) => {
    moves[Number(ix)] = { id: ix, ...move };
  });
  return moves;
}

export async function joinGame(gameId: string, nick: string): Promise<() => void> {
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

      becomePlayer(ref, nick, game);
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
      const moveArray = game.m ? toArray(game.m) : [];
      GameState.multiplayer.assign({
        gameId,
        opponentName: game.w === GameSettings.playerId.peek() ? game.bn : game.wn,
        isWhite: game.w === GameSettings.playerId.peek(),
      });
      GameState.moveCount.set(moveArray.length);
      if (moveArray.length) {
        applyMoves(moveArray);
      }
    }
    const expectedMove = GameState.moveCount.peek();
    if (game.m?.[expectedMove]) {
      const m = game.m[expectedMove];
      const p = GameState.pieces.peek().find((p) => p.id === m.p);
      // Only process opponent move updates
      if (p!.black === GameState.multiplayer.isWhite.peek()) {
        applyMoves([{ ...game.m[expectedMove], id: String(expectedMove) }]);
        GameState.moveCount.set(expectedMove + 1);
      }
    }
    return true;
  });
}
