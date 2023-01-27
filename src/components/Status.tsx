import { observer } from '@legendapp/state/react';
import { Button, Icon, Slider, Text } from '@rneui/themed';
import * as React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';

import { PieceImage } from './PieceImage';
import { Direction } from '../models/Piece';
import { completeMove, GameState, resetGame } from '../state';

const DIR_SIZE = { width: 50, height: 50 };

const Rotations = {
  N: 0,
  NW: -45,
  NE: 45,
  W: -90,
  E: 90,
  S: 180,
  SW: -135,
  SE: 135,
};

function Arrow({
  direction,
  available,
  onPress,
}: {
  direction: Direction;
  available: Direction[];
  onPress: (d: Direction) => void;
}) {
  const proposedDir = GameState.proposed.direction.get();
  const isProposed = proposedDir === direction;
  const anyProposed = proposedDir !== undefined;

  if (!available.includes(direction)) {
    return <View style={DIR_SIZE} />;
  }

  const style: ViewStyle = {
    transform: [{ rotate: `${Rotations[direction]}deg` }],
  };

  if (anyProposed && !isProposed) {
    style.opacity = 0.3;
  }

  return (
    <Pressable style={DIR_SIZE} onPress={() => onPress(direction)}>
      <Icon name="arrow-up" type="feather" style={style} size={DIR_SIZE.height} />
    </Pressable>
  );
}

export const Status = observer(() => {
  const whiteToMove = GameState.whiteToMove.get();
  const proposed = GameState.proposed.get();
  const directions = proposed.piece?.availableDirections(GameState) || [];

  const onPress = React.useCallback((direction: Direction) => {
    GameState.proposed.direction.set(direction);
  }, []);

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

  if (proposed.piece) {
    return (
      <>
        <View style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <Arrow direction="NW" available={directions} onPress={onPress} />
            <Arrow direction="N" available={directions} onPress={onPress} />
            <Arrow direction="NE" available={directions} onPress={onPress} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Arrow direction="W" available={directions} onPress={onPress} />
            <PieceImage piece={proposed.piece} style={DIR_SIZE} />
            <Arrow direction="E" available={directions} onPress={onPress} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Arrow direction="SW" available={directions} onPress={onPress} />
            <Arrow direction="S" available={directions} onPress={onPress} />
            <Arrow direction="SE" available={directions} onPress={onPress} />
          </View>
        </View>
        {proposed.direction && (
          <View>
            <Slider
              maximumValue={1}
              minimumValue={0}
              value={proposed.distance}
              onValueChange={GameState.proposed.distance.set}
            />
            {proposed.distance ? (
              <Button title="Complete Move" style={{ marginTop: 15 }} onPress={completeMove} />
            ) : undefined}
          </View>
        )}
      </>
    );
  }

  return (
    <View style={{ alignItems: 'center' }}>
      <Text h4>{whiteToMove ? 'White to move' : 'Black to move'}</Text>
    </View>
  );
});
