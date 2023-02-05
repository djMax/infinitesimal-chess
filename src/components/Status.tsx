import { observer } from '@legendapp/state/react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Text, useTheme } from '@rneui/themed';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { DirectionSelection } from './DirectionSelection';
import { KnightDirectionSelection } from './KnightDirectionSelection';
import { ScaleAdjust } from './ScaleAdjust';
import { suggestMove } from '../models/ai/aiManager';
import { RootStackParamList } from '../screens/RootStackParamList';
import { GameState } from '../state';
import { proposeDirection, proposePiece, setMoveScale, shareGameId } from '../state/actions';

export const Status = observer(() => {
  const { theme } = useTheme();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const whiteToMove = GameState.whiteToMove.get();
  const isMultiplayer = !!GameState.multiplayer.gameId.get();
  const iAmWhite = GameState.multiplayer.isWhite.get();
  const pieceId = GameState.proposed.pieceId.get();

  if (GameState.gameOver.get()) {
    return (
      <View style={{ alignItems: 'center', flex: 1, alignContent: 'space-between' }}>
        <Text h1>Game Over</Text>
        <Text>{GameState.whiteToMove.get() ? 'Black' : 'White'} Wins!</Text>

        <View style={{ width: '100%' }}>
          <Button
            title="New Game"
            style={{ marginTop: 25, width: '100%' }}
            onPress={() => nav.replace('Intro')}
          />
        </View>
      </View>
    );
  }

  if (pieceId) {
    const piece = GameState.pieces.find((p) => p.id === pieceId)!;
    return (
      <>
        {piece.type !== 'Knight' ? (
          <DirectionSelection piece={piece} />
        ) : (
          <KnightDirectionSelection piece={piece} />
        )}
        <ScaleAdjust />
      </>
    );
  }

  if (isMultiplayer) {
    const myMove = whiteToMove === iAmWhite;
    const opponentName = GameState.multiplayer.opponentName.get();
    const moveCount = GameState.moveCount.get();

    const nothingYet = !moveCount || !opponentName;

    return (
      <View style={{ alignItems: 'center' }}>
        <Text h4 style={{ marginBottom: 5 }}>
          {myMove
            ? `It's your move, playing ${iAmWhite ? 'white' : 'black'}`
            : `${GameState.multiplayer.opponentName.get()}'s move, playing ${
                iAmWhite ? 'black' : 'white'
              }`}
        </Text>
        {whiteToMove === iAmWhite && <Text>Tap on a piece to start a move</Text>}
        {!myMove && <ActivityIndicator />}

        {nothingYet && (
          <View style={{ flex: 1, marginTop: 20, paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 16, textAlign: 'center' }}>
              Your opponent has not accepted the invitation yet.
            </Text>
            <Button
              type="clear"
              title="Send Again"
              titleStyle={{
                color: theme.mode === 'dark' ? theme.colors.warning : theme.colors.primary,
              }}
              onPress={() => {
                shareGameId(GameState.multiplayer.gameId.peek()!);
              }}
            />
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={{ alignItems: 'center' }}>
      <Text h4>{whiteToMove ? 'White to move' : 'Black to move'}</Text>
      <Text>Tap on a piece to start a move</Text>
      {GameState.allowAi.get() && (
        <Button
          type="clear"
          title="Suggest a Move"
          onPress={() => {
            const raw = GameState.peek();
            const move = suggestMove(raw, 0);
            const pieceIndex = raw.pieces.findIndex((p) => p.id === move.p)!;
            proposePiece(GameState.pieces[pieceIndex]);
            if (move.v) {
              GameState.proposed.assign({
                variant: move.v,
              });
            }
            proposeDirection(move.d);
            // TODO this isn't right - scale should match piece capabilities
            setMoveScale(1, true);
          }}
        />
      )}
    </View>
  );
});

Status.whyDidYouRender = true;
