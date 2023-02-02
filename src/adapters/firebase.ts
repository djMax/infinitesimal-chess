import analytics from '@react-native-firebase/analytics';
import database from '@react-native-firebase/database';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import remoteConfig from '@react-native-firebase/remote-config';

import { RemoteConfigDefaults, RemoteConfigs } from './default-config';

export async function trackScreen(screenName?: string) {
  if (!screenName) {
    await analytics().logScreenView({
      screen_class: screenName,
      screen_name: screenName,
    });
  }
}

export async function setRemoteDb(ref: string, doc: any) {
  const gameRef = database().ref(ref);
  await gameRef.set(doc);
}

export async function assignRemoteDb(ref: string, doc: any) {
  const gameRef = database().ref(ref);
  await gameRef.update(doc);
}

export async function getDbAndNotify(docRef: string, fn: (v: any) => boolean) {
  const gameRef = database().ref(docRef);
  const handler = gameRef.on('value', (snapshot) => {
    console.log('Got new snapshot', docRef);
    fn(snapshot.val());
  });
  return () => gameRef.off('value', handler);
}

export function onLink(handler: (link: string) => void): () => void {
  const unsub = dynamicLinks().onLink((link) => {
    handler(link.url);
  });
  dynamicLinks()
    .getInitialLink()
    .then((link) => {
      if (link?.url) {
        handler(link.url);
      }
    });
  return unsub;
}

export async function activateRemoteConfig() {
  return remoteConfig()
    .setDefaults(RemoteConfigDefaults)
    .then(() => {
      return remoteConfig().fetchAndActivate();
    });
}

export function internalGetRemoteConfig(key: keyof RemoteConfigs) {
  return remoteConfig().getValue(key);
}
