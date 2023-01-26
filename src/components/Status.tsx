import * as React from 'react';
import { observer } from "@legendapp/state/react";
import { Button, Icon, Slider, Text } from "@rneui/themed";
import { ImageStyle, Pressable, View, ViewStyle } from "react-native";
import { Direction } from "../models/Piece";
import { GameState } from "../state";
import { PieceImage } from "./PieceImage";

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

function Arrow({ direction, available, onPress }: { direction: Direction, available: Direction[], onPress: (d: Direction) => void }) {
  const proposedDir = GameState.proposed.direction.get();
  const isProposed = proposedDir === direction;
  const anyProposed = proposedDir !== undefined;

  if (!available.includes(direction)) {
    return (
      <View style={DIR_SIZE}></View>
    );
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
};

export const Status = observer(() => {
  const whiteToMove = GameState.whiteToMove.get();
  const proposed = GameState.proposed.get();
  const directions = proposed.piece?.availableDirections(GameState) || [];

  const onPress = React.useCallback((direction: Direction) => {
    GameState.proposed.direction.set(direction);
  }, []);

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
            <Slider maximumValue={1} minimumValue={0} value={proposed.distance} onValueChange={GameState.proposed.distance.set} />
            {proposed.distance ? (
              <Button
                title="Complete Move"
                style={{ marginTop: 15 }}
                onPress={() => {
                  const newPos = proposed.piece!.getScaledMove(GameState, proposed.direction!, proposed.distance);
                  GameState.proposed.piece.assign({ position: newPos });
                  GameState.proposed.piece.set(undefined);
                  GameState.proposed.direction.set(undefined);
                  GameState.proposed.distance.set(1);
                  GameState.whiteToMove.set(!GameState.whiteToMove.get());
                }}
              />
            ): undefined}
          </View>
        )}
      </>
    )
  }

  return (
    <View style={{ alignItems: 'center' }}>
      <Text h4>{whiteToMove ? 'White to move' : 'Black to move'}</Text>
    </View>
  )
});
