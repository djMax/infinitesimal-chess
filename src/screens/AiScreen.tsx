import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, CheckBox, Text, useTheme } from '@rneui/themed';
import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from './RootStackParamList';
import { initializeAi } from '../models/ai/aiManager';
import { getFen } from '../models/ai/fen';
import { GameState } from '../state';
import { resetGame } from '../state/actions';

const CHECKBOX_SIZE = 24;

const styles = StyleSheet.create({
  checkbox: {
    backgroundColor: 'transparent',
    marginTop: 20,
  },
  cbText: {
    fontSize: 18,
  },
  text: {
    marginHorizontal: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },
  section: {},
  scroller: {
    flex: 1,
    justifyContent: 'space-around',
  },
});

export function AiScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'AiSetup'>) {
  const [white, setWhite] = React.useState(true);
  const [level, setLevel] = React.useState(0);
  const { theme } = useTheme();

  const startGame = React.useCallback(() => {
    resetGame();
    initializeAi(level, getFen(GameState.peek()));
    GameState.ai.assign({
      level,
      isWhite: !white,
    });
    navigation.navigate('Game');
  }, [level, navigation, white]);

  return (
    <SafeAreaView
      style={{ flex: 1, alignContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 }}>
      <ScrollView contentInset={{ top: 20 }} contentContainerStyle={styles.scroller}>
        <View style={styles.section}>
          <Text style={styles.text}>Choose AI Level</Text>
          <Picker selectedValue={level} onValueChange={setLevel}>
            <Picker.Item label="Well-trained monkey" value="0" />
            <Picker.Item label="Beginner" value="1" />
            <Picker.Item label="Intermediate" value="2" />
            <Picker.Item label="Advanced" value="3" />
            <Picker.Item label="Experienced" value="4" />
          </Picker>
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>Which side will you play?</Text>
          <CheckBox
            size={32}
            title="White"
            textStyle={styles.cbText}
            containerStyle={styles.checkbox}
            checkedIcon={
              <FontAwesome5 color={theme.colors.black} name="dot-circle" size={CHECKBOX_SIZE} />
            }
            uncheckedIcon={
              <FontAwesome5 color={theme.colors.black} name="circle" size={CHECKBOX_SIZE} />
            }
            checked={white}
            onPress={() => setWhite(true)}
          />
          <CheckBox
            size={32}
            title="Black"
            textStyle={styles.cbText}
            containerStyle={styles.checkbox}
            checkedIcon={
              <FontAwesome5 color={theme.colors.black} name="dot-circle" size={CHECKBOX_SIZE} />
            }
            uncheckedIcon={
              <FontAwesome5 color={theme.colors.black} name="circle" size={CHECKBOX_SIZE} />
            }
            checked={!white}
            onPress={() => setWhite(false)}
          />
        </View>
      </ScrollView>

      <Button style={{ marginBottom: 20 }} title="Let's Go!" onPress={startGame} />
    </SafeAreaView>
  );
}
