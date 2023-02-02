import { NavigationContainerRef } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { onLink } from '../adapters/firebase';
import { joinGame } from '../adapters/firebase-common';
import { RootStackParamList } from '../screens/RootStackParamList';

export function handleLink(navigation: NavigationContainerRef<RootStackParamList>, link: string) {
  const parsed = Linking.parse(link);
  console.log('Received link', link);
  if (parsed?.queryParams?.id) {
    const id = parsed.queryParams.id!;
    console.log('Joining game', id);
    joinGame(String(id)).then(() => {
      console.log('Joined');
      navigation.navigate('Game');
    });
  }
}

export function setupDynamicLinks(fn: (link: string) => void) {
  return onLink(fn);
}
