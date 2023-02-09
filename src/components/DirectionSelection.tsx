import { observer } from '@legendapp/state/react';
import { Button } from '@rneui/themed';
import * as React from 'react';
import { ImageStyle, Platform, StyleSheet, View } from 'react-native';

import { Arrow, DIR_SIZE } from './Arrow';
import { PieceImage } from './PieceImage';
import { Piece } from '../models/Piece';
import { Position } from '../models/Position';
import { getOverlappingPieces } from '../models/topology';
import { GameState } from '../state';
import { completeMove, proposeDirection } from '../state/actions';
import { canCastle } from '../state/castle';

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
  const isCastlePiece = piece.type === 'King' || piece.type === 'Rook';
  const showCastle = React.useMemo(() => {
    if (isCastlePiece) {
      const king =
        piece.type === 'King'
          ? piece
          : GameState.pieces.peek().find((p) => p.sameTeam(piece) && p.type === 'King')!;
      const castles: ('L' | 'R')[] = [];
      if (canCastle(GameState.peek(), piece.black, true)) {
        const overlap = getOverlappingPieces(
          king,
          new Position(0, king.position.y),
          GameState.pieces.peek(),
        );
        if (
          overlap?.pieces.length === 1 &&
          overlap?.pieces[0].type === 'Rook' &&
          overlap?.pieces[0].sameTeam(king)
        ) {
          castles.push('L');
        }
      }
      if (canCastle(GameState.peek(), piece.black, false)) {
        const overlap = getOverlappingPieces(
          king,
          new Position(GameState.size.peek(), king.position.y),
          GameState.pieces.peek(),
        );
        if (
          overlap?.pieces.length === 1 &&
          overlap?.pieces[0].type === 'Rook' &&
          overlap?.pieces[0].sameTeam(king)
        ) {
          castles.push('R');
        }
      }
      return castles;
    }
    return [];
  }, [isCastlePiece, piece]);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: isCastlePiece ? 'space-between' : 'space-around',
      }}>
      {isCastlePiece && (
        <View style={{ justifyContent: 'center' }}>
          <Button
            type="clear"
            title="Castle Left"
            disabled={!showCastle.includes('L')}
            onPress={() => {
              const king =
                piece.type === 'King'
                  ? piece
                  : GameState.pieces.peek().find((p) => p.sameTeam(piece) && p.type === 'King')!;
              completeMove(GameState, king, 'W', undefined, king.position.add([-2, 0]));
            }}
          />
        </View>
      )}
      <View style={{ alignItems: 'center', marginLeft: isCastlePiece ? 15 : 0 }}>
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
      {isCastlePiece && (
        <View style={{ justifyContent: 'center' }}>
          <Button
            type="clear"
            title="Castle Right"
            disabled={!showCastle.includes('R')}
            onPress={() => {
              const king =
                piece.type === 'King'
                  ? piece
                  : GameState.pieces.peek().find((p) => p.sameTeam(piece) && p.type === 'King')!;
              completeMove(GameState, king, 'E', undefined, king.position.add([2, 0]));
            }}
          />
        </View>
      )}
    </View>
  );
});
