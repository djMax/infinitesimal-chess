import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text } from '@rneui/themed';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from './RootStackParamList';

const textStyle = {
  fontSize: 15,
  marginBottom: 20,
};

export function IntroScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Intro'>) {
  return (
    <SafeAreaView
      style={{ flex: 1, alignContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 }}>
      <ScrollView contentInset={{ top: 20 }}>
        <Text h1 style={{ textAlign: 'center', marginBottom: 20 }}>
          ε Chess
        </Text>
        <Text style={textStyle}>
          Welcome to ε Chess! ε Chess resembles regular chess, but with one key change - pieces
          can move to any point along the line of their normal move.
        </Text>
        <Text style={textStyle}>
          For example, your first pawn move can end anywhere between the starting point and
          2 squares ahead. You can move 0.001 squares, 1.999 squares, or anything in between.
        </Text>
        <Text style={textStyle}>
          Your pieces have a size (currently 70% of a square). If your piece overlaps an opponent's
          piece at all - even by a tiny fraction - you capture it. This means that it is possible
          to capture more than one piece with a single move.
        </Text>
      </ScrollView>
      <Button title="Play" onPress={() => navigation.navigate('Game')} />
    </SafeAreaView>
  );
}
