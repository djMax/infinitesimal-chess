import { useTheme } from '@rneui/themed';
import { Pressable, View, ViewStyle } from 'react-native';

import { ArrowUp } from './svg/ArrowUp';
import { Direction } from '../models/types';

export const DIR_SIZE = { width: 30, height: 30 };

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

export function Arrow({
  direction,
  available,
  proposed,
  onPress,
  style: inStyle,
}: {
  direction: Direction;
  available: Direction[];
  proposed?: string;
  onPress: (d: Direction) => void;
  style?: ViewStyle;
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
    <Pressable style={[DIR_SIZE, inStyle]} onPress={() => onPress(direction)}>
      <ArrowUp style={style} stroke={theme.colors.black} />
    </Pressable>
  );
}
