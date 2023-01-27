import { Observable } from '@legendapp/state';
import { For, observer } from '@legendapp/state/react';
import { useTheme } from '@rneui/themed';
import * as React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';

import { PieceImage } from './PieceImage';
import { Status } from './Status';
import { Piece } from '../models/Piece';
import { GameSettings, GameState } from '../state';

const GRID = Array(8).fill(0);

function background(x: number, y: number) {
  return (x + y) % 2 === 0 ? '#FFDEAD' : '#DFB787';
}

interface PressablePieceProps {
  piece: Observable<Piece>;
  size: number;
  onPress: (piece: Observable<Piece>) => void;
  selected: boolean;
}

const PressablePiece = observer(({ piece, size, onPress }: PressablePieceProps) => {
  const boardSize = GameState.size.get();
  const r = piece.radius.get();
  const viewStyle: ViewStyle = {
    position: 'absolute',
    left: size * piece.position.x.get() - size * r,
    top: size * boardSize - size * piece.position.y.get() - size * r,
  };
  const imgStyle = GameSettings.boardSettings.halo.get()
    ? {
        borderRadius: size * r,
        backgroundColor: piece.black ? '#FFFFFFB0' : '#00000050',
        width: size * r * 2,
        height: size * r * 2,
      }
    : {
        width: size * r * 2,
        height: size * r * 2,
      };

  const proposed = GameState.proposed.piece.get();
  const direction = GameState.proposed.direction.get();
  const amount = GameState.proposed.distance.get();

  if (proposed?.id === piece.id.get()) {
    Object.assign(imgStyle, {
      borderRadius: size * r,
      backgroundColor: piece.black ? '#00FF00B0' : '#00FF000050',
    });

    if (direction) {
      const position = piece.getScaledMove(GameState, direction, amount);
      viewStyle.left = size * position.x - size * r;
      viewStyle.top = size * boardSize - size * position.y - size * r;
      console.log(position.toString());
    }
  } else if (direction && proposed && proposed.black !== piece.black.get()) {
    const curCenter = proposed.getScaledMove(GameState, direction, amount);
    if (curCenter.squareDistance(piece.position.get()) < (r + proposed.radius) ** 2) {
      Object.assign(imgStyle, {
        borderRadius: size * r,
        backgroundColor: piece.black ? '#FF0000B0' : '#FF00000050',
      });
    }
  }

  return (
    <Pressable onPress={() => onPress(piece)} style={viewStyle}>
      <PieceImage piece={piece.get()} style={imgStyle} />
    </Pressable>
  );
});

export const Board = observer(
  ({ size, top, left }: { size: number; top: number; left: number }) => {
    const { theme } = useTheme();
    const useBg = GameSettings.boardSettings.background.get() === 'default';

    const onPiecePress = React.useCallback((piece: Observable<Piece>) => {
      if (GameState.whiteToMove.get() === piece.black.get()) {
        return;
      }
      GameState.proposed.direction.set(undefined);
      const p = piece.get();
      GameState.proposed.piece.set(p);
      const d = p.availableDirections(GameState);
      if (d.length === 1) {
        GameState.proposed.direction.set(d[0]);
      }
    }, []);

    const selectedPiece = GameState.proposed.piece.get()?.id || '';

    return (
      <>
        <View
          style={{
            position: 'absolute',
            top: top + size * GameState.size.get() + 30,
            width: '90%',
          }}>
          <Status />
        </View>
        <View
          style={{
            borderWidth: 2,
            borderColor: theme.colors.black,
            position: 'absolute',
            top,
            left,
          }}>
          {GRID.map((_, y) => (
            <View key={y} style={{ height: size, flexDirection: 'row' }}>
              {GRID.map((_, x) => (
                <View
                  key={x}
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: useBg ? background(x, y) : undefined,
                  }}
                />
              ))}
            </View>
          ))}
          <For<Piece, never> each={GameState.board.black}>
            {(piece) => (
              <PressablePiece
                piece={piece}
                size={size}
                onPress={onPiecePress}
                key={piece.id.get()}
                selected={selectedPiece === piece.id.get()}
              />
            )}
          </For>
          <For<Piece, never> each={GameState.board.white}>
            {(piece) => (
              <PressablePiece
                piece={piece}
                size={size}
                onPress={onPiecePress}
                key={piece.id.get()}
                selected={selectedPiece === piece.id.get()}
              />
            )}
          </For>
        </View>
      </>
    );
  },
);
