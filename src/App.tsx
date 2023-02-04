import { observer } from '@legendapp/state/react';
import { createTheme, lightColors, darkColors, ThemeProvider, useThemeMode } from '@rneui/themed';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { ActivityIndicator, Platform, useColorScheme } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import { activateRemoteConfig } from './adapters/firebase';
import { AnimatedAppLoader } from './components/AnimatedSplash';
import { Navigation } from './screens/Nav';
import { AppState } from './state';

const theme = createTheme({
  lightColors: {
    ...Platform.select({
      default: lightColors.platform.android,
      ios: lightColors.platform.ios,
    }),
  },
  darkColors: {
    ...Platform.select({
      default: darkColors.platform.android,
      ios: darkColors.platform.ios,
    }),
  },
});

function ColorScheme({ children }: React.PropsWithChildren<object>) {
  const colorMode = useColorScheme();
  const { setMode, mode } = useThemeMode();

  React.useEffect(() => {
    // If you want a proper deps array, you have to be careful not to just
    // blindly setMode, because that will change the value of setMode
    const targetMode = colorMode === 'dark' ? 'dark' : 'light';
    if (mode !== targetMode) {
      setMode(targetMode);
    }
  }, [colorMode, mode, setMode]);

  return <>{children}</>;
}

SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

const AppStateSpinner = observer(() => <Spinner visible={AppState.spinner.get()} />);

const App = () => {
  const [appReady, setAppReady] = React.useState(false);

  React.useEffect(() => {
    activateRemoteConfig()
      .catch((e) => {
        console.error('Failed to get remote config', e);
      })
      .then(() => {
        setAppReady(true);
      });
  }, []);

  if (Platform.OS === 'web' && !appReady) {
    return <ActivityIndicator />;
  }

  return Platform.OS === 'web' ? (
    <ThemeProvider theme={theme}>
      <ColorScheme>
        <AppStateSpinner />
        <Navigation />
      </ColorScheme>
    </ThemeProvider>
  ) : (
    <AnimatedAppLoader ready={appReady}>
      <ThemeProvider theme={theme}>
        <ColorScheme>
          <AppStateSpinner />
          <Navigation />
        </ColorScheme>
      </ThemeProvider>
    </AnimatedAppLoader>
  );
};

export default App;
