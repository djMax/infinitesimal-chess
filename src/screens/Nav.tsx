import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameScreen } from './GameScreen';
import { SettingsButton } from '../components/SettingsButton';
import { SettingsScreen } from './SettingsScreen';
import { IntroScreen } from './IntroScreen';
import { RootStackParamList } from './RootStackParamList';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="Game" component={GameScreen} options={{
        headerTitle: '',
        headerBackTitleVisible: false,
        headerBackVisible: false,
        headerShadowVisible: false,
        headerRight() {
          return <SettingsButton />
        },
      }} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
