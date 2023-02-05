import { getAnalytics, logEvent } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { ref, set, update, onValue, getDatabase } from 'firebase/database';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';

import { RemoteConfigDefaults, RemoteConfigs } from './default-config';

const firebaseConfig = {
  apiKey: 'AIzaSyDnc_5Do7-GgRc1iZSfNwO4wIE0Jk533wA',
  authDomain: 'infinitechess-67dbe.firebaseapp.com',
  projectId: 'infinitechess-67dbe',
  storageBucket: 'infinitechess-67dbe.appspot.com',
  messagingSenderId: '732200193213',
  appId: '1:732200193213:web:cfd65195d0dc5d607ebbd4',
  measurementId: 'G-CK4R65YSQ4',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export async function trackScreen(screenName?: string) {
  if (screenName) {
    logEvent(analytics, screenName, { screen_name: screenName });
  }
}

export async function setRemoteDb(docRef: string, doc: any) {
  const db = getDatabase(app);
  const gameRef = ref(db, docRef);
  return set(gameRef, doc);
}

export async function assignRemoteDb(docRef: string, doc: any) {
  const db = getDatabase(app);
  const gameRef = ref(db, docRef);
  console.log('Assign', docRef, doc);
  return update(gameRef, doc);
}

export async function getDbAndNotify(docRef: string, fn: (v: any) => boolean) {
  const db = getDatabase(app);
  const gameRef = ref(db, docRef);
  const sub = onValue(gameRef, (snapshot) => {
    console.log('Got new snapshot', docRef, snapshot.val());
    fn(snapshot.val());
  });
  return sub;
}

export function onLink() {
  return () => {};
}

const rConfig = getRemoteConfig(app);

export async function activateRemoteConfig() {
  rConfig.defaultConfig = RemoteConfigDefaults;
  return fetchAndActivate(rConfig);
}

export function internalGetRemoteConfig(key: keyof RemoteConfigs) {
  return getValue(rConfig, key);
}

export function crashlyticsLog(log: string) {
  console.log(log);
}
