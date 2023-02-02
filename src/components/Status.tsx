import { observer } from '@legendapp/state/react';
import { Button, Text } from '@rneui/themed';
import * as React from 'react';
import { View } from 'react-native';

import { DirectionSelection } from './DirectionSelection';
import { KnightDirectionSelection } from './KnightDirectionSelection';
import { ScaleAdjust } from './ScaleAdjust';
import { GameState } from '../state';
import { resetGame } from '../state/actions';

export const Status = observer(() => {
  const whiteToMove = GameState.whiteToMove.get();
  const isMultiplayer = !!GameState.multiplayer.gameId.get();
  const iAmWhite = GameState.multiplayer.isWhite.get();
  const pieceId = GameState.proposed.pieceId.get();

  if (GameState.gameOver.get()) {
    const king = GameState.dead.find((p) => p.type === 'King');
    return (
      <View style={{ width: '100%', alignItems: 'center', flex: 1, alignContent: 'space-between' }}>
        <Text h1>Game Over</Text>
        <Text>{king?.black ? 'White' : 'Black'} Wins!</Text>

        <View style={{ width: '100%' }}>
          <Button
            title="New Game"
            style={{ marginTop: 25, width: '100%' }}
            onPress={() => resetGame()}
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
    return (
      <View style={{ alignItems: 'center' }}>
        <Text h4>{whiteToMove === iAmWhite ? 'Your move' : 'Waiting for their move...'}</Text>
        {whiteToMove === iAmWhite && <Text>Tap on a piece to start a move</Text>}
      </View>
    );
  }

  return (
    <View style={{ alignItems: 'center' }}>
      <Text h4>{whiteToMove ? 'White to move' : 'Black to move'}</Text>
      <Text>Tap on a piece to start a move</Text>
    </View>
  );
});

Status.whyDidYouRender = true;
