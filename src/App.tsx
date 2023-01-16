import * as React from 'react';
import { createTheme, lightColors, darkColors, ThemeProvider, useThemeMode, useTheme } from '@rneui/themed';
import { Platform, useColorScheme } from 'react-native';
import { Navigation } from './screens/Nav';

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

function ColorScheme({ children }: React.PropsWithChildren<{}>) {
  const colorMode = useColorScheme();
  const { theme } = useTheme();
  const { setMode } = useThemeMode();

  React.useEffect(() => {
    setMode(colorMode === 'dark' ? 'dark' : 'light');
  }, [colorMode]);

  return <>{children}</>;
}

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <ColorScheme>
        <Navigation />
      </ColorScheme>
    </ThemeProvider>
  );
};

export default App;
