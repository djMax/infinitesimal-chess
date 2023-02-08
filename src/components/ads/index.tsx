import { Platform, View } from 'react-native';
import mobileAds, {
  BannerAd,
  BannerAdSize,
  MaxAdContentRating,
  TestIds,
} from 'react-native-google-mobile-ads';

import { getRemoteConfiguration } from '../../adapters/firebase-common';

const AdUnits = {
  multiplayerWait: {
    ios: 'ca-app-pub-5250702741281167/7907596361',
    android: 'ca-app-pub-5250702741281167/9242312036',
  },
};

function getAdUnitId(name: keyof typeof AdUnits) {
  if (__DEV__) {
    return TestIds.BANNER;
  }
  const unit = AdUnits[name] as Record<string, string>;
  if (!unit) {
    throw new Error(`No ad unit for ${name}`);
  }
  return unit[Platform.OS];
}

let complete = false;
mobileAds()
  .setRequestConfiguration({
    // Update all future requests suitable for parental guidance
    maxAdContentRating: MaxAdContentRating.PG,

    // Indicates that you want the ad request to be handled in a
    // manner suitable for users under the age of consent.
    tagForUnderAgeOfConsent: true,

    // An array of test device IDs to allow.
    testDeviceIdentifiers: ['EMULATOR'],
  })
  .then(() => mobileAds().initialize())
  .then(() => {
    complete = true;
  });

function shouldShowAds() {
  return complete && getRemoteConfiguration<boolean>('show_ads', 'boolean');
}

export function MultiplayerWaitBanner() {
  const id = getAdUnitId('multiplayerWait');

  if (!id || !shouldShowAds()) {
    return null;
  }

  return (
    <View>
      <BannerAd unitId={id} size={BannerAdSize.FULL_BANNER} />
    </View>
  );
}
