import { observer } from '@legendapp/state/react';
import { Text } from '@rneui/themed';
import * as React from 'react';
import { View } from 'react-native';

import { Arrow, DIR_SIZE } from './Arrow';
import { Direction, Piece } from '../models/Piece';
import { GameState } from '../state';

const MOVE_MAP: Record<Direction, string[]> = {
  N: ['ENN', 'NNE'],
  NE: ['EEN', 'NEE'],
  E: ['EES', 'SEE'],
  SE: ['ESS', 'SSE'],
  S: ['WSS', 'SSW'],
  SW: ['WWS', 'SWW'],
  W: ['WWN', 'NWW'],
  NW: ['WNN', 'NNW'],
};

function Rosette({
  proposed,
  available,
  onPress,
  moveNumber,
}: {
  proposed?: Direction;
  available: Direction[];
  onPress: (d: Direction) => void;
  moveNumber: number;
}) {
  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <View style={DIR_SIZE} />
        <View>
          <Arrow proposed={proposed} direction="N" available={available} onPress={onPress} />
        </View>
        <View style={DIR_SIZE} />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View>
          <Arrow proposed={proposed} direction="W" available={available} onPress={onPress} />
        </View>
        <View style={{ ...DIR_SIZE, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, paddingRight: 5 }}>{moveNumber}</Text>
        </View>
        <View>
          <Arrow proposed={proposed} direction="E" available={available} onPress={onPress} />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={DIR_SIZE} />
        <View>
          <Arrow proposed={proposed} direction="S" available={available} onPress={onPress} />
        </View>
        <View style={DIR_SIZE} />
      </View>
    </View>
  );
}

function setKnightMove(move1: Direction, move2: Direction, move3: Direction) {
  const heading = `${move1}${move2}${move3}`;
  const direction = Object.entries(MOVE_MAP).find(([_, v]) => v.includes(heading))![0] as Direction;
  GameState.proposed.assign({
    direction,
    variant: ['N', 'S'].includes(move1) ? 'VH' : 'HV',
  });
}

export const KnightDirectionSelection = observer(({ piece }: { piece: Piece }) => {
  const availableDirections = GameState.proposed.availableDirections.get();
  const [move1, setMove1] = React.useState<Direction>();
  const [move2, setMove2] = React.useState<Direction>();
  const [move3, setMove3] = React.useState<Direction>();

  React.useEffect(() => {
    setMove1(undefined);
    setMove2(undefined);
    setMove3(undefined);
  }, [piece]);

  const moves = React.useMemo(() => {
    return availableDirections.reduce((acc, d) => {
      acc.push(...MOVE_MAP[d]);
      return acc;
    }, [] as string[]);
  }, availableDirections);

  const availableFirstMoves = React.useMemo(() => {
    return moves.map((m) => m[0] as Direction);
  }, [availableDirections]);

  const availableSecondMoves = React.useMemo<Direction[]>(() => {
    if (move1) {
      return moves.filter((m) => m[0] === move1).map((m) => m[1] as Direction);
    }
    return ['N', 'S', 'E', 'W'];
  }, [move1]);

  const availableThirdMoves = React.useMemo<Direction[]>(() => {
    if (move1 && move2) {
      return moves.filter((m) => m[0] === move1 && m[1] === move2).map((m) => m[2] as Direction);
    }
    return ['N', 'S', 'E', 'W'];
  }, [move1, move2]);

  const onMove1Selection = React.useCallback(
    (d: Direction) => {
      if (d !== move1) {
        setMove1(d);
        setMove2(undefined);
        setMove3(undefined);
      }
    },
    [move1],
  );

  const onMove2Selection = React.useCallback(
    (d: Direction) => {
      if (move1) {
        setMove2(d);
        const left = moves
          .filter((m) => m[0] === move1 && m[1] === d)
          .map((m) => m[2] as Direction);
        if (left.length === 1) {
          setMove3(left[0] as Direction);
        } else if (move3 && !left.includes(move3)) {
          setMove3(undefined);
        }
      }
    },
    [move1, move3],
  );

  React.useEffect(() => {
    if (move1 && move2 && move3) {
      setKnightMove(move1, move2, move3);
    }
  }, [move1, move2, move3]);

  // The "fake" NW value in here is to get the arrows to be grayed out
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      <Rosette
        moveNumber={1}
        proposed={move1}
        available={availableFirstMoves}
        onPress={onMove1Selection}
      />
      <Rosette
        moveNumber={2}
        proposed={move2 || 'NW'}
        available={availableSecondMoves}
        onPress={onMove2Selection}
      />
      <Rosette
        moveNumber={3}
        proposed={move3 || 'NW'}
        available={availableThirdMoves}
        onPress={(d) => move1 && move2 && setMove3(d)}
      />
    </View>
  );
});
