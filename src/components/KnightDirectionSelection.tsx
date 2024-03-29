import { beginBatch, endBatch } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { Text } from '@rneui/themed';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { Arrow, DIR_SIZE } from './Arrow';
import { PieceImage } from './PieceImage';
import { Piece } from '../models/Piece';
import { Knight } from '../models/pieces/Knight';
import { Direction } from '../models/types';
import { GameState } from '../state';
import { setMoveScale } from '../state/actions';

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

const styles = StyleSheet.create({
  e: Platform.select({
    web: {
      top: 5,
      left: -5,
    },
    default: {},
  }),
  w: Platform.select({
    web: {},
    default: {
      top: 1,
      left: 2.5,
    },
  }),
  s: Platform.select({
    web: {
      marginLeft: -6,
    },
    default: {},
  }),
});

function Rosette({
  piece,
  proposed,
  available,
  onPress,
}: {
  piece?: Knight;
  proposed?: Direction;
  available: Direction[];
  onPress: (d: Direction) => void;
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
          <Arrow
            proposed={proposed}
            direction="W"
            available={available}
            onPress={onPress}
            style={styles.w}
          />
        </View>
        <View style={{ ...DIR_SIZE }}>
          {piece && (
            <PieceImage
              piece={piece}
              style={{ width: DIR_SIZE.width - 5, height: DIR_SIZE.height - 5 }}
            />
          )}
        </View>
        <View>
          <Arrow
            proposed={proposed}
            direction="E"
            available={available}
            onPress={onPress}
            style={styles.e}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={DIR_SIZE} />
        <View>
          <Arrow
            proposed={proposed}
            direction="S"
            available={available}
            onPress={onPress}
            style={styles.s}
          />
        </View>
        <View style={DIR_SIZE} />
      </View>
    </View>
  );
}

function setKnightMove(move1: Direction, move2: Direction, move3: Direction) {
  const heading = `${move1}${move2}${move3}`;
  const direction = Object.entries(MOVE_MAP).find(([_, v]) => v.includes(heading))![0] as Direction;
  beginBatch();
  GameState.proposed.assign({
    direction,
    variant: ['N', 'S'].includes(move1) ? 'VH' : 'HV',
  });
  const exDist = GameState.proposed.distance.peek();
  // Default to full move if no distance has been selected
  setMoveScale(exDist || 1, true);
  endBatch();
}

export const KnightDirectionSelection = observer(({ piece }: { piece: Piece }) => {
  const availableDirections = GameState.proposed.availableDirections.get();
  const [move1, setMove1] = React.useState<Direction>();
  const [move2, setMove2] = React.useState<Direction>();
  const [move3, setMove3] = React.useState<Direction>();

  React.useEffect(() => {
    const { variant, direction } = GameState.proposed.peek();
    if (direction && variant) {
      const delta = Knight.getDelta(direction);
      if (variant === 'HV') {
        setMove1(delta[0] > 0 ? 'E' : 'W');
        if (Math.abs(delta[0]) === 2) {
          setMove2(delta[0] > 0 ? 'E' : 'W');
        } else {
          setMove2(delta[1] > 0 ? 'S' : 'N');
        }
        setMove3(delta[1] > 0 ? 'S' : 'N');
      } else {
        setMove1(delta[0] > 0 ? 'S' : 'N');
        if (Math.abs(delta[1]) === 2) {
          setMove2(delta[1] > 0 ? 'S' : 'N');
        } else {
          setMove2(delta[0] > 0 ? 'E' : 'W');
        }
        setMove3(delta[0] > 0 ? 'E' : 'W');
      }
    } else {
      setMove1(undefined);
      setMove2(undefined);
      setMove3(undefined);
    }
  }, [piece]);

  const moves = React.useMemo(() => {
    return availableDirections.reduce((acc, d) => {
      acc.push(...MOVE_MAP[d]);
      return acc;
    }, [] as string[]);
  }, [availableDirections]);

  const availableFirstMoves = React.useMemo(() => {
    return moves.map((m) => m[0] as Direction);
  }, [moves]);

  const availableSecondMoves = React.useMemo<Direction[]>(() => {
    if (move1) {
      return moves.filter((m) => m[0] === move1).map((m) => m[1] as Direction);
    }
    return ['N', 'S', 'E', 'W'];
  }, [moves, move1]);

  const availableThirdMoves = React.useMemo<Direction[]>(() => {
    if (move1 && move2) {
      return moves.filter((m) => m[0] === move1 && m[1] === move2).map((m) => m[2] as Direction);
    }
    return ['N', 'S', 'E', 'W'];
  }, [moves, move1, move2]);

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
    [moves, move1, move3],
  );

  const onMove1Selection = React.useCallback(
    (d: Direction) => {
      if (d !== move1) {
        setMove1(d);
        const left = moves.filter((m) => m[0] === d);
        if (left.every((d) => d[1] === left[0][1])) {
          onMove2Selection(left[0][1] as Direction);
        } else {
          setMove2(undefined);
          setMove3(undefined);
          GameState.proposed.assign({
            direction: undefined,
          });
        }
      }
    },
    [moves, onMove2Selection, move1],
  );

  React.useEffect(() => {
    if (move1 && move2 && move3) {
      setKnightMove(move1, move2, move3);
    }
  }, [move1, move2, move3]);

  const knight = piece as Knight;
  // The "fake" NW value in here is to get the arrows to be grayed out
  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Rosette
          piece={!move1 ? knight : undefined}
          proposed={move1}
          available={availableFirstMoves}
          onPress={onMove1Selection}
        />
        <Rosette
          piece={move1 && !move2 ? knight : undefined}
          proposed={move2 || 'NW'}
          available={availableSecondMoves}
          onPress={onMove2Selection}
        />
        <Rosette
          piece={move2 ? knight : undefined}
          proposed={move3 || 'NW'}
          available={availableThirdMoves}
          onPress={(d) => move1 && move2 && setMove3(d)}
        />
      </View>
      {!move2 && (
        <View style={{ alignItems: 'center' }}>
          <Text>Select the {move1 ? 'second' : 'first'} direction the knight should move.</Text>
        </View>
      )}
    </>
  );
});
