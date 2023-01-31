import { observer } from '@legendapp/state/react';
import { Button, Slider, Text, useTheme } from '@rneui/themed';
import * as React from 'react';
import { ImageStyle, Platform, Pressable, View, ViewStyle } from 'react-native';

import { ArrowUp } from './ArrowUp';
import { PieceImage } from './PieceImage';
import { Direction } from '../models/Piece';
import { GameState } from '../state';
import { completeMove, proposeDirection, resetGame, setMoveScale } from '../state/actions';

const DIR_SIZE = { width: 30, height: 30 };

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
  proposed,
  onPress,
}: {
  direction: Direction;
  available: Direction[];
  proposed?: string;
  onPress: (d: Direction) => void;
}) {
  const { theme } = useTheme();
  const isProposed = proposed === direction;
  const anyProposed = proposed !== undefined;

  if (!available.includes(direction)) {
    return <View style={DIR_SIZE} />;
  }

  const style: ViewStyle = {
    ...DIR_SIZE,
    transform: [{ rotate: `${Rotations[direction]}deg` }],
  };

  if (anyProposed && !isProposed) {
    style.opacity = 0.3;
  }

  return (
    <Pressable style={DIR_SIZE} onPress={() => onPress(direction)}>
      <ArrowUp style={style} stroke={theme.colors.black} />
    </Pressable>
  );
}

export const Status = observer(() => {
  const whiteToMove = GameState.whiteToMove.get();
  const proposed = GameState.proposed.get();
  const directions = proposed.availableDirections;

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

  if (proposed.pieceId) {
    const piece = GameState.pieces.find((p) => p.id === proposed.pieceId)!;
    return (
      <>
        <View style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <Arrow
              proposed={proposed.direction}
              direction="NW"
              available={directions}
              onPress={proposeDirection}
            />
            <Arrow
              proposed={proposed.direction}
              direction="N"
              available={directions}
              onPress={proposeDirection}
            />
            <Arrow
              proposed={proposed.direction}
              direction="NE"
              available={directions}
              onPress={proposeDirection}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Arrow
              proposed={proposed.direction}
              direction="W"
              available={directions}
              onPress={proposeDirection}
            />
            <PieceImage
              piece={piece}
              style={Platform.select<ImageStyle>({
                web: DIR_SIZE,
                default: { ...DIR_SIZE, marginRight: 6 },
              })}
            />
            <Arrow direction="E" available={directions} onPress={proposeDirection} />
          </View>
          <View style={{ flexDirection: 'row', marginTop: 4 }}>
            <Arrow
              proposed={proposed.direction}
              direction="SW"
              available={directions}
              onPress={proposeDirection}
            />
            <Arrow
              proposed={proposed.direction}
              direction="S"
              available={directions}
              onPress={proposeDirection}
            />
            <Arrow
              proposed={proposed.direction}
              direction="SE"
              available={directions}
              onPress={proposeDirection}
            />
          </View>
        </View>
        {proposed.direction && (
          <View>
            <Slider
              maximumValue={1}
              minimumValue={0}
              value={proposed.distance}
              onValueChange={setMoveScale}
            />
            {proposed.distance ? (
              <Button
                disabled={proposed.valid === false}
                title="Complete Move"
                style={{ marginTop: 15 }}
                onPress={() => completeMove(GameState)}
              />
            ) : undefined}
          </View>
        )}
      </>
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
