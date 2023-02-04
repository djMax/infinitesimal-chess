import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@rneui/themed';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { Settings } from './svg/Settings';
import { RootStackParamList } from '../screens/RootStackParamList';

const settingsIcon = Platform.select({
  web: {
    marginRight: 15,
  },
});

export function SettingsButton() {
  const { theme } = useTheme();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Pressable style={settingsIcon} onPress={() => nav.navigate('Settings')}>
      <Settings stroke={theme.colors.black} />
    </Pressable>
  );
}
