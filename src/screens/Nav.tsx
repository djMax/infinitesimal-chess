import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameScreen } from './GameScreen';
import { SettingsButton } from '../components/SettingsButton';
import { SettingsScreen } from './SettingsScreen';

export type RootStackParamList = {
  Game: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Game" component={GameScreen} options={{
        headerTitle: '',
        headerShadowVisible: false,
        headerRight() {
          return <SettingsButton />
        },
      }} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
