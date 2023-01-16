import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createTheme, lightColors, darkColors, ThemeProvider, useThemeMode, useTheme } from '@rneui/themed';
import { Platform, Pressable, useColorScheme, View } from 'react-native';
import { GameScreen } from './src/screens/GameScreen';
import { SettingsButton } from './src/components/SettingsButton';

const Stack = createNativeStackNavigator();

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
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Game" component={GameScreen} options={{
              headerTitle: '',
              headerShadowVisible: false,
              headerRight() {
                return <SettingsButton />
              },
            }} />
          </Stack.Navigator>
        </NavigationContainer>
      </ColorScheme>
    </ThemeProvider>
  );
};

export default App;
