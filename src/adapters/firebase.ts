import analytics from '@react-native-firebase/analytics';

export async function trackScreen(screenName?: string) {
  if (!screenName) {
    await analytics().logScreenView({
      screen_class: screenName,
      screen_name: screenName,
    });
  }
}
