import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '@rneui/themed';
import { View } from 'react-native';

import { RootStackParamList } from './RootStackParamList';

export function IntroScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Intro'>) {
  return (
    <View>
      <Button title="Play" onPress={() => navigation.navigate('Game')} />
    </View>
  );
}
