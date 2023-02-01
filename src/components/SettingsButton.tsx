import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@rneui/themed';
import { Pressable } from 'react-native';

import { Settings } from './svg/Settings';
import { RootStackParamList } from '../screens/RootStackParamList';

export function SettingsButton() {
  const { theme } = useTheme();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Pressable onPress={() => nav.navigate('Settings')}>
      <Settings stroke={theme.colors.black} />
    </Pressable>
  );
}
