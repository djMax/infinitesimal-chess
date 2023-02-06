import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, CheckBox, Text, useTheme } from '@rneui/themed';
import { AiLevel } from 'js-chess-engine';
import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { RootStackParamList } from './RootStackParamList';
import { initializeAi } from '../models/ai/aiManager';
import { getFen } from '../models/ai/fen';
import { GameState } from '../state';
import { resetGame } from '../state/actions';
import { useStyles } from '../styles';

const CHECKBOX_SIZE = 24;

const localStyles = StyleSheet.create({
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
  scroller: {
    flex: 1,
    justifyContent: 'space-around',
  },
});

export function AiScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'AiSetup'>) {
  const [white, setWhite] = React.useState(true);
  const [level, setLevel] = React.useState<AiLevel>(0);
  const { theme } = useTheme();
  const styles = useStyles();

  const startGame = React.useCallback(() => {
    resetGame();
    initializeAi(level, getFen(GameState.peek()));
    GameState.ai.assign({
      level,
      isWhite: !white,
    });
    navigation.replace('Game');
  }, [level, navigation, white]);

  return (
    <View
      style={{ flex: 1, alignContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 }}>
      <Pressable style={styles.topX} onPress={() => navigation.goBack()}>
        <FontAwesome5 name="times" size={24} color={theme.colors.black} />
      </Pressable>
      <ScrollView contentInset={{ top: 20 }} contentContainerStyle={localStyles.scroller}>
        <View>
          <Text style={localStyles.text}>Choose AI Level</Text>
          <Picker style={{ marginTop: 20 }} selectedValue={level} onValueChange={setLevel}>
            <Picker.Item
              style={{ color: theme.colors.black }}
              label="Well-trained monkey"
              value="0"
            />
            <Picker.Item color={theme.colors.black} label="Beginner" value="1" />
            <Picker.Item color={theme.colors.black} label="Intermediate" value="2" />
            <Picker.Item color={theme.colors.black} label="Advanced" value="3" />
            <Picker.Item color={theme.colors.black} label="Experienced" value="4" />
          </Picker>
        </View>
        <View>
          <Text style={localStyles.text}>Which side will you play?</Text>
          <CheckBox
            size={32}
            title="White"
            textStyle={localStyles.cbText}
            containerStyle={localStyles.checkbox}
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
            textStyle={localStyles.cbText}
            containerStyle={localStyles.checkbox}
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

      <Button
        containerStyle={styles.button}
        titleStyle={styles.buttonText}
        title="Let's Go!"
        onPress={startGame}
      />
    </View>
  );
}
