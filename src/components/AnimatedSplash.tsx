import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface ImageProp {
  image: { uri: string };
  ready: boolean;
}

function AnimatedSplashScreen({ children, image, ready }: React.PropsWithChildren<ImageProp>) {
  const animation = React.useMemo(() => new Animated.Value(1), []);
  const [isSplashAnimationComplete, setAnimationComplete] = React.useState(false);

  React.useEffect(() => {
    if (ready) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }
  }, [animation, ready]);

  const onImageLoaded = React.useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      // handle errors
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {ready && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: Constants.manifest!.splash!.backgroundColor,
              opacity: animation,
            },
          ]}>
          <Animated.Image
            style={{
              width: '100%',
              height: '100%',
              resizeMode: Constants.manifest!.splash!.resizeMode || 'contain',
            }}
            source={image}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  );
}

export function AnimatedAppLoader({
  children,
  ready,
}: React.PropsWithChildren<{ ready: boolean }>) {
  const [isSplashReady, setSplashReady] = React.useState(false);
  const image = React.useMemo(
    () => ({ uri: Asset.fromModule(require('../../assets/splash.png')).uri }),
    [],
  );

  React.useEffect(() => {
    async function prepare() {
      setSplashReady(true);
    }

    prepare();
  }, [image]);

  if (!isSplashReady) {
    return null;
  }

  return (
    <AnimatedSplashScreen ready={ready} image={image}>
      {children}
    </AnimatedSplashScreen>
  );
}
