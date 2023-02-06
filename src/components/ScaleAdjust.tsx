import { beginBatch, endBatch } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { Button, Slider, Text } from '@rneui/themed';
import * as React from 'react';
import { View } from 'react-native';

import { applyMoveToAi, getAiMove } from '../models/ai/aiManager';
import { AppState, GameState } from '../state';
import { applyMoves, completeMove, setMoveScale } from '../state/actions';
import { useStyles } from '../styles';

export const ScaleAdjust = observer(() => {
  const styles = useStyles();
  const id = GameState.proposed.pieceId.get();
  const direction = GameState.proposed.direction.get();
  const distance = GameState.proposed.distance.get();
  const valid = GameState.proposed.valid.get();
  const slideComplete = React.useCallback((value: number) => {
    beginBatch();
    setMoveScale(value, true);
    endBatch();
  }, []);

  const isAi = GameState.ai.get();
  const nextMove = React.useCallback(() => {
    const { move, taken } = completeMove(GameState);
    if (isAi && !GameState.peek().gameOver) {
      AppState.spinner.set(true);
      applyMoveToAi(GameState.peek(), move, taken);
      try {
        const move = getAiMove(GameState.peek());
        console.log('AI Move', move);
        applyMoves([move]);
      } catch (error) {
        console.error('Failed to make AI move', error);
      } finally {
        AppState.spinner.set(false);
      }
    }
  }, [isAi]);

  if (!direction) {
    return (
      <View style={{ alignItems: 'center' }}>
        {!id?.includes('Knight') && <Text>Select a direction or tap on the board</Text>}
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 15 }}>
      <Slider
        maximumValue={1}
        minimumValue={0}
        value={distance}
        onValueChange={setMoveScale}
        onSlidingComplete={slideComplete}
      />
      {distance ? (
        <Button
          disabled={valid === false}
          containerStyle={styles.button}
          titleStyle={styles.buttonText}
          title="Complete Move"
          style={{ marginTop: 15 }}
          onPress={nextMove}
        />
      ) : undefined}
    </View>
  );
});
