import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@rneui/themed';
import * as Linking from 'expo-linking';
import * as React from 'react';

import { AiScreen } from './AiScreen';
import { GameScreen } from './GameScreen';
import { IntroScreen } from './IntroScreen';
import { MultiplayerScreen } from './MultiplayerScreen';
import { RootStackParamList } from './RootStackParamList';
import { SettingsScreen } from './SettingsScreen';
import { trackScreen } from '../adapters/firebase';
import { handleLink, setupDynamicLinks } from '../state/links';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  const { theme } = useTheme();
  const routeNameRef = React.useRef<string>();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  const navTheme = React.useMemo(
    () => ({
      dark: theme.mode === 'dark',
      colors: {
        ...(theme.mode === 'dark' ? DarkTheme : DefaultTheme).colors,
        background: theme.colors.background,
        primary: theme.colors.primary,
        text: theme.colors.black,
      },
    }),
    [theme.mode, theme.colors],
  );

  const link = Linking.useURL() || undefined;
  const linkHandler = React.useCallback(
    (link?: string) => {
      if (link && navigationRef.current) {
        handleLink(navigationRef.current, link);
      }
    },
    [navigationRef],
  );
  React.useEffect(() => linkHandler(link), [link, linkHandler]);
  React.useEffect(() => {
    return setupDynamicLinks(linkHandler);
  }, [linkHandler]);

  return (
    <ActionSheetProvider>
      <NavigationContainer
        theme={navTheme}
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

          if (previousRouteName !== currentRouteName) {
            await trackScreen(currentRouteName);
          }
          routeNameRef.current = currentRouteName;
        }}>
        <Stack.Navigator>
          <Stack.Screen name="Intro" component={IntroScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="Game"
            component={GameScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MultiplayerSetup"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
            component={MultiplayerScreen}
          />
          <Stack.Screen
            name="AiSetup"
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
            component={AiScreen}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
};
