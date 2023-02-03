import { NavigationContainerRef } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { onLink } from '../adapters/firebase';
import { RootStackParamList } from '../screens/RootStackParamList';

export function handleLink(navigation: NavigationContainerRef<RootStackParamList>, link: string) {
  const parsed = Linking.parse(link);
  console.log('Received link', link);
  if (parsed?.queryParams?.id) {
    const id = parsed.queryParams.id!;
    navigation.navigate('MultiplayerSetup', { gameId: String(id) });
  }
}

export function setupDynamicLinks(fn: (link: string) => void) {
  return onLink(fn);
}
