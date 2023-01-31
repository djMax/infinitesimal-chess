import { getAnalytics, logEvent } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

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
