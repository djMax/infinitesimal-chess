import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, CheckBox, Input, Text, useTheme } from '@rneui/themed';
import * as Clipboard from 'expo-clipboard';
import * as React from 'react';
import { Platform, ScrollView, Share, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from './RootStackParamList';
import { createGame, joinGame } from '../adapters/firebase-common';
import { GameSettings, GameState } from '../state';
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

export function MultiplayerScreen({
  navigation,
  route: {
    params: { gameId },
  },
}: NativeStackScreenProps<RootStackParamList, 'MultiplayerSetup'>) {
  const [nickname, setNickname] = React.useState<string | undefined>(GameSettings.nickname.get());
  const [white, setWhite] = React.useState(false);
  const { theme } = useTheme();

  const startGame = React.useCallback(() => {
    createGame(nickname!, white).then((gameId) => {
      const url = `https://pyralis.page.link?link=${encodeURIComponent(
        `https://chess.pyralis.com/?id=${gameId}`,
      )}`;
      resetGame();
      GameState.multiplayer.assign({
        gameId,
        isWhite: white,
        moveCount: 0,
      });
      navigation.replace('Game');
      if (Platform.OS === 'web') {
        Clipboard.setStringAsync(url).then(() => {
          alert('A game link copied to clipboard. Send it to your opponent.');
        });
      } else {
        Share.share({
          message: 'Play ε Chess with me!',
          url,
          title: 'ε Chess',
        });
      }
    });
  }, [white, nickname, navigation]);

  const join = React.useCallback(() => {
    console.log('Joining game', gameId);
    joinGame(gameId!, nickname!).then(() => {
      console.log('Joined');
      navigation.navigate('Game');
    });
  }, [navigation, nickname, gameId]);

  return (
    <SafeAreaView
      style={{ flex: 1, alignContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 }}>
      <ScrollView contentInset={{ top: 20 }} contentContainerStyle={styles.scroller}>
        <View style={styles.section}>
          <Text style={styles.text}>Pick a nickname</Text>
          <Input value={nickname} onChangeText={setNickname} autoFocus />
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>Which side will you play?</Text>
          <CheckBox
            disabled={!!gameId}
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
            disabled={!!gameId}
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

      <Button
        disabled={!nickname?.trim()}
        style={{ marginBottom: 20 }}
        title={gameId ? 'Join Game' : 'Invite Opponent'}
        onPress={gameId ? join : startGame}
      />
    </SafeAreaView>
  );
}
