import { NavigationContainerRef } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { onLink } from '../adapters/firebase';
import { joinGame } from '../adapters/firebase-common';
import { RootStackParamList } from '../screens/RootStackParamList';

export function handleLink(navigation: NavigationContainerRef<RootStackParamList>, link: string) {
  const parsed = Linking.parse(link);
  console.log('Received link', link, parsed.path);
  if (parsed?.queryParams?.id) {
    const id = parsed.queryParams.id!;
    if (parsed.queryParams.nick) {
      joinGame(String(id), String(parsed.queryParams.nick!)).then(() => {
        console.log('Joined');
        navigation.navigate('Game');
      });
    } else {
      navigation.navigate('MultiplayerSetup', { gameId: String(id) });
    }
  }
  if (parsed.path === 'chess/privacy.html') {
    WebBrowser.openBrowserAsync(link);
  }
}

export function setupDynamicLinks(fn: (link: string) => void) {
  return onLink(fn);
}
