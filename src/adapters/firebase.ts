import analytics from '@react-native-firebase/analytics';
import database from '@react-native-firebase/database';
import uuid from 'react-native-uuid';

import { GameSettings, GameState } from '../state';
import { resetGame } from '../state/actions';

export async function trackScreen(screenName?: string) {
  if (!screenName) {
    await analytics().logScreenView({
      screen_class: screenName,
      screen_name: screenName,
    });
  }
}

export async function createGame(isWhite: boolean): Promise<string> {
  const gameId = String(uuid.v4());
  const gameRef = database().ref(`games/${gameId}`);
  await gameRef.set({
    start: Date.now(),
    [isWhite ? 'white' : 'black']: GameSettings.playerId.get(),
  });
  return gameId;
}

export async function joinGame(gameId: string): Promise<boolean> {
  const gameRef = database().ref(`games/${gameId}`);
  const snapshot = await gameRef.once('value');
  const game = snapshot.val();
  let isWhite = false;
  if (game && !game.black) {
    await gameRef.update({
      black: GameSettings.playerId.get(),
    });
  } else if (game && !game.white) {
    await gameRef.update({
      white: GameSettings.playerId.get(),
    });
    isWhite = true;
  } else {
    return false;
  }
  resetGame();
  GameState.multiplayer.assign({
    gameId,
    isWhite,
  });
  return true;
}
