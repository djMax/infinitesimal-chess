import analytics from '@react-native-firebase/analytics';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { GameScreen } from './GameScreen';
import { IntroScreen } from './IntroScreen';
import { RootStackParamList } from './RootStackParamList';
import { SettingsScreen } from './SettingsScreen';
import { SettingsButton } from '../components/SettingsButton';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  const routeNameRef = React.useRef<string>();
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}>
      <Stack.Navigator>
        <Stack.Screen name="Intro" component={IntroScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{
            headerTitle: '',
            headerBackTitleVisible: false,
            headerBackVisible: false,
            headerShadowVisible: false,
            headerRight() {
              return <SettingsButton />;
            },
          }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
