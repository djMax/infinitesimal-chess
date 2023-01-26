import * as React from 'react';
import { observer } from '@legendapp/state/react';
import { Pressable, View, ViewStyle } from 'react-native';
import { GameSettings, GameState } from '../state';
import { Piece } from '../models/Piece';
import { Status } from './Status';
import { useTheme } from '@rneui/themed';
import { useStyles } from '../styles';
import { PieceImage } from './PieceImage';

const GRID = Array(8).fill(0);

function background(x: number, y: number) {
  return (x + y) % 2 === 0 ? '#FFDEAD' : '#DFB787';
}

interface PressablePieceProps {
  piece: Piece;
  size: number;
  onPress: (piece: Piece) => void;
  selected: boolean;
}

const PressablePiece = observer(({ piece, size, onPress }: PressablePieceProps) => {
  const boardSize = GameState.size.get();
  const viewStyle: ViewStyle = {
    position: 'absolute',
    left: size * piece.position.x - size * piece.radius,
    top: size * boardSize - size * piece.position.y - size * piece.radius,
  };
  const imgStyle = GameSettings.boardSettings.halo.get() ? {
    borderRadius: size * piece.radius,
    backgroundColor: piece.black ? '#FFFFFFB0' : '#00000050',
    width: size * piece.radius * 2,
    height: size * piece.radius * 2,
  } : {
    width: size * piece.radius * 2,
    height: size * piece.radius * 2,
  };

  const proposed = GameState.proposed.piece.get();
  const direction = GameState.proposed.direction.get();
  const amount = GameState.proposed.distance.get();

  if (proposed === piece) {
    Object.assign(imgStyle, {
      borderRadius: size * piece.radius,
      backgroundColor: piece.black ? '#00FF00B0' : '#00FF000050',
    });

    if (direction) {
      const position = piece.getScaledMove(GameState, direction, amount);
      viewStyle.left = size * position.x - size * piece.radius;
      viewStyle.top = size * boardSize - size * position.y - size * piece.radius;
      console.log(position.toString());
    }
  } else if (direction && proposed && proposed.black !== piece.black) {
    const curCenter = proposed.getScaledMove(GameState, direction, amount);
    if (curCenter.squareDistance(piece.position) < (piece.radius + proposed.radius) ** 2) {
      Object.assign(imgStyle, {
        borderRadius: size * piece.radius,
        backgroundColor: piece.black ? '#FF0000B0' : '#FF00000050',
      });  
    }
  }

  return (
    <Pressable onPress={() => onPress(piece)} style={viewStyle}>
      <PieceImage piece={piece} style={imgStyle} />
    </Pressable>
  );
});

export const Board = observer(({ size, top, left }: { size: number, top: number, left: number }) => {
  const { theme } = useTheme();
  const styles = useStyles();
  const useBg = GameSettings.boardSettings.background.get() === 'default';

  const onPiecePress = React.useCallback((piece: Piece) => {
    if (GameState.whiteToMove.get() === piece.black) {
      return;
    }
    GameState.proposed.direction.set(undefined);
    GameState.proposed.piece.set(piece);
  }, []);

  const selectedPiece = GameState.proposed.piece.get()?.id || '';

  return (
    <>
    <View style={{ position: 'absolute', top: top + size * GameState.size.get() + 30, width: '90%' }}>
      <Status />
    </View>
    <View style={{ borderWidth: 2, borderColor: theme.colors.black, position: 'absolute', top, left }}>
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
      {GameState.board.black.map((piece, i) => (
        <PressablePiece piece={piece.get()} size={size} onPress={onPiecePress} key={String(i)} selected={selectedPiece === piece.id.get()} />
      ))}
      {GameState.board.white.map((piece, i) => (
        <PressablePiece piece={piece.get()} size={size} onPress={onPiecePress} key={String(i)} selected={selectedPiece === piece.id.get()} />
      ))}
    </View>
    </>
  );
});

