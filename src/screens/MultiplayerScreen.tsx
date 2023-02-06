import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, CheckBox, Input, Text, useTheme } from '@rneui/themed';
import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { RootStackParamList } from './RootStackParamList';
import { createGame, joinGame } from '../adapters/firebase-common';
import { GameSettings, GameState } from '../state';
import { resetGame, shareGameId } from '../state/actions';
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

export function MultiplayerScreen({
  navigation,
  route: {
    params: { gameId },
  },
}: NativeStackScreenProps<RootStackParamList, 'MultiplayerSetup'>) {
  const [nickname, setNickname] = React.useState<string | undefined>(
    GameSettings.nickname.get() || '',
  );
  const [white, setWhite] = React.useState(true);
  const { theme } = useTheme();
  const styles = useStyles();

  const startGame = React.useCallback(() => {
    GameSettings.nickname.set(nickname!);
    createGame(nickname!, white).then((gameId) => {
      resetGame();
      GameState.multiplayer.assign({
        gameId,
        isWhite: white,
      });
      shareGameId(gameId).then(() => {
        navigation.replace('Game');
      });
    });
  }, [white, nickname, navigation]);

  const join = React.useCallback(() => {
    GameSettings.nickname.set(nickname!);
    console.log('Joining game', gameId);
    joinGame(gameId!, nickname!).then(() => {
      console.log('Joined');
      navigation.replace('Game');
    });
  }, [navigation, nickname, gameId]);

  return (
    <View
      style={{ flex: 1, alignContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 }}>
      <Pressable style={styles.topX} onPress={() => navigation.goBack()}>
        <FontAwesome5 name="times" size={24} color={theme.colors.black} />
      </Pressable>
      <ScrollView contentInset={{ top: 20 }} contentContainerStyle={localStyles.scroller}>
        <View>
          <Text style={localStyles.text}>Pick a nickname</Text>
          <Input value={nickname} onChangeText={setNickname} autoFocus />
        </View>
        <View>
          <Text style={localStyles.text}>
            {gameId ? 'You will play:' : 'Which side will you play?'}
          </Text>
          {(!gameId || white) && (
            <CheckBox
              disabled={!!gameId}
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
          )}

          {(!gameId || !white) && (
            <CheckBox
              disabled={!!gameId}
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
          )}
        </View>
      </ScrollView>

      <Button
        containerStyle={styles.button}
        titleStyle={styles.buttonText}
        disabled={!nickname?.trim()}
        title={gameId ? 'Join Game' : 'Invite Opponent'}
        onPress={gameId ? join : startGame}
      />
    </View>
  );
}
