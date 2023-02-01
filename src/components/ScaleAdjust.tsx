import { observer } from '@legendapp/state/react';
import { Button, Slider } from '@rneui/themed';
import * as React from 'react';
import { View } from 'react-native';

import { GameState } from '../state';
import { completeMove, setMoveScale } from '../state/actions';

export const ScaleAdjust = observer(() => {
  const direction = GameState.proposed.direction.get();
  const distance = GameState.proposed.distance.get();
  const valid = GameState.proposed.valid.get();

  if (!direction) {
    return null;
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
