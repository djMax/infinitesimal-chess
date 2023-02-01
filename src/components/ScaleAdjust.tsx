import { observer } from '@legendapp/state/react';
import { Button, Slider, Text } from '@rneui/themed';
import * as React from 'react';
import { View } from 'react-native';

import { GameState } from '../state';
import { completeMove, setMoveScale } from '../state/actions';

export const ScaleAdjust = observer(() => {
  const id = GameState.proposed.pieceId.get();
  const direction = GameState.proposed.direction.get();
  const distance = GameState.proposed.distance.get();
  const valid = GameState.proposed.valid.get();

  if (!direction) {
    return (
      <View style={{ alignItems: 'center' }}>
        {!id?.includes('Knight') && <Text>Select a direction or tap on the board</Text>}
      </View>
    );
  }

  return (
    <View>
      <Slider maximumValue={1} minimumValue={0} value={distance} onValueChange={setMoveScale} />
      {distance ? (
        <Button
          disabled={valid === false}
          title="Complete Move"
          style={{ marginTop: 15 }}
          onPress={() => completeMove(GameState)}
        />
      ) : undefined}
    </View>
  );
});
