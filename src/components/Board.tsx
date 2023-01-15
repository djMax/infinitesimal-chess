import * as React from 'react';
import { observer } from '@legendapp/state/react';
import { Image, ImageStyle, View } from 'react-native';
import { GameState } from '../state';
import { Piece, PieceType } from '../models/Piece';
import { Status } from './Status';
import { useTheme } from '@rneui/themed';

const GRID = Array(8).fill(0);

function background(x: number, y: number) {
  return (x + y) % 2 === 0 ? '#FFDEAD' : '#DFB787';
}

const BlackPieces: Record<PieceType, any> = {
  Pawn: require('../../assets/bp.png'),
  Bishop: require('../../assets/bb.png'),
  King: require('../../assets/bk.png'),
  Knight: require('../../assets/bn.png'),
  Queen: require('../../assets/bq.png'),
  Rook: require('../../assets/br.png'),
};

const WhitePieces: Record<PieceType, any> = {
  Pawn: require('../../assets/wp.png'),
  Bishop: require('../../assets/wb.png'),
  King: require('../../assets/wk.png'),
  Knight: require('../../assets/wn.png'),
  Queen: require('../../assets/wq.png'),
  Rook: require('../../assets/wr.png'),
}

function getStyle(piece: Piece, size: number): ImageStyle {
  return {
    position: 'absolute',
    width: size * piece.radius * 2,
    height: size * piece.radius * 2,
    left: size * piece.position.x - size * piece.radius,
    top: size * 8 - size * piece.position.y - size * piece.radius,
  };
}

export const Board = observer(({ size, top, left }: { size: number, top: number, left: number }) => {
  const { theme } = useTheme();

  return (
    <>
    <View style={{ position: 'absolute', top: top - 80 }}>
      <Status black={false} />
    </View>
    <View style={{ position: 'absolute', top: top + size * 8 + 60 }}>
      <Status black={true} />
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
              backgroundColor: background(x, y),
            }}
          />
          ))}
        </View>
      ))}
      {GameState.board.black.map((piece, i) => (
        <Image source={BlackPieces[piece.type.get()]} key={i} style={getStyle(piece.get(), size)} />
      ))}
      {GameState.board.white.map((piece, i) => (
        <Image source={WhitePieces[piece.type.get()]} key={i} style={getStyle(piece.get(), size)} />
      ))}
    </View>
    </>
  );
});

