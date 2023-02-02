import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text } from '@rneui/themed';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from './RootStackParamList';
import { createGame, getRemoteConfiguration } from '../adapters/firebase-common';
import { GameState } from '../state';
import { resetGame } from '../state/actions';

const textStyle = {
  fontSize: 15,
  marginBottom: 20,
};

export function IntroScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Intro'>) {
  return (
    <SafeAreaView
      style={{ flex: 1, alignContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 }}>
      <>
        <ScrollView contentInset={{ top: 20 }}>
          <Text h1 style={{ textAlign: 'center', marginBottom: 20 }}>
            ε Chess
          </Text>
          <Text style={textStyle}>
            Welcome to ε Chess! ε Chess resembles regular chess, but with one key change - pieces
            can move to any point along the line of their normal move.
          </Text>
          <Text style={textStyle}>
            For example, your first pawn move can end anywhere between the starting point and 2
            squares ahead. You can move 0.001 squares, 1.999 squares, or anything in between.
          </Text>
          <Text style={textStyle}>
            Your pieces have a size (currently 70% of a square). If your piece overlaps an
            opponent's piece at all - even by a tiny fraction - you capture it. This means that it
            is possible to capture more than one piece with a single move.
          </Text>
          <Text style={textStyle}>
            Move mechanics are a work in progress - especially for the knight. Generally, tap on a
            piece to select it and then tap on the board where you want to go. You can fine tune
            this with the directional arrows and the slider.
          </Text>
          <Text style={textStyle}>
            For the knight, there will be three sets of arrows, one for each step of the move.
            Select each one in succession, and then set the amount of the move with the slider or by
            pressing the board.
          </Text>
        </ScrollView>

        {getRemoteConfiguration('allow_multiplayer', 'boolean') && (
          <Button
            style={{ marginBottom: 20 }}
            title="Invite Opponent"
            onPress={() => {
              const isWhite = true;
              createGame(isWhite).then((gameId) => {
                Clipboard.setString(`https://chess.pyralis.com/play/game?id=${gameId}`);
                resetGame();
                GameState.multiplayer.assign({
                  gameId,
                  isWhite,
                });
                navigation.replace('Game');
              });
            }}
          />
        )}

        <Button
          title="Local Multiplayer"
          onPress={() => {
            resetGame();
            navigation.replace('Game');
          }}
        />
      </>
    </SafeAreaView>
  );
}
