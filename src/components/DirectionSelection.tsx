import { observer } from '@legendapp/state/react';
import * as React from 'react';
import { ImageStyle, Platform, StyleSheet, View } from 'react-native';

import { Arrow, DIR_SIZE } from './Arrow';
import { PieceImage } from './PieceImage';
import { Piece } from '../models/Piece';
import { GameState } from '../state';
import { proposeDirection } from '../state/actions';

const styles = StyleSheet.create({
  n: Platform.select({
    web: {
      top: 2,
      left: 3,
    },
    default: {},
  }),
  e: Platform.select({
    web: {
      top: 5,
      left: -3,
    },
    default: {},
  }),
  ne: Platform.select({
    web: {
      top: 3,
    },
    default: {},
  }),
  se: Platform.select({
    web: {
      left: -4,
    },
    default: {},
  }),
  s: Platform.select({
    web: {
      left: -3,
      top: -3,
    },
    default: {},
  }),
  sw: Platform.select({
    web: {
      top: -3,
    },
    default: {},
  }),
});

export const DirectionSelection = observer(({ piece }: { piece: Piece }) => {
  const direction = GameState.proposed.direction.get();
  const directions = GameState.proposed.availableDirections.get();

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ flexDirection: 'row' }}>
        <Arrow
          proposed={direction}
          direction="NW"
          available={directions}
          onPress={proposeDirection}
        />
        <Arrow
          proposed={direction}
          direction="N"
          available={directions}
          onPress={proposeDirection}
          style={styles.n}
        />
        <Arrow
          proposed={direction}
          direction="NE"
          available={directions}
          onPress={proposeDirection}
          style={styles.ne}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Arrow
          proposed={direction}
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
        <Arrow
          proposed={direction}
          direction="E"
          available={directions}
          onPress={proposeDirection}
          style={styles.e}
        />
      </View>
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        <Arrow
          proposed={direction}
          direction="SW"
          available={directions}
          onPress={proposeDirection}
          style={styles.sw}
        />
        <Arrow
          proposed={direction}
          direction="S"
          available={directions}
          onPress={proposeDirection}
          style={styles.s}
        />
        <Arrow
          proposed={direction}
          direction="SE"
          available={directions}
          onPress={proposeDirection}
          style={styles.se}
        />
      </View>
    </View>
  );
});
