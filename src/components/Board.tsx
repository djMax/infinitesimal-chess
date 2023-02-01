import { Observable } from '@legendapp/state';
import { For, observer } from '@legendapp/state/react';
import { useTheme } from '@rneui/themed';
import * as React from 'react';
import { Platform, Pressable, View, ViewStyle } from 'react-native';

import { PieceImage } from './PieceImage';
import { Status } from './Status';
import { Piece } from '../models/Piece';
import { Position } from '../models/Position';
import { nearestPoint } from '../models/topology';
import { GameSettings, GameState } from '../state';
import { proposePiece, setMoveScale } from '../state/actions';

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

  const proposedId = GameState.proposed.pieceId.get();

  const threatened = piece.threatened.get();
  const canThreaten = piece.canThreaten.get();
  if (threatened) {
    Object.assign(imgStyle, {
      borderRadius: size * r,
      backgroundColor: piece.black ? '#FF0000B0' : '#FF0000B0',
    });
  } else if (canThreaten) {
    Object.assign(imgStyle, {
      borderRadius: size * r,
      backgroundColor: piece.black ? '#CCCC00B0' : '#CCCC00B0',
    });
  }

  if (proposedId === piece.id.get()) {
    Object.assign(imgStyle, {
      borderRadius: size * r,
      backgroundColor: piece.black ? '#00FF00B0' : '#00FF0050',
    });

    const position = GameState.proposed.position!.get()!;
    viewStyle.left = size * position.x - size * r;
    viewStyle.top = size * boardSize - size * position.y - size * r;
  }

  return (
    <Pressable onPress={() => onPress(piece)} style={viewStyle}>
      <PieceImage piece={piece.get()} style={imgStyle} />
    </Pressable>
  );
});

PressablePiece.whyDidYouRender = true;

function getBoardPosition(x: number, y: number, squareSize: number, boardSize: number) {
  return [x / squareSize, boardSize - y / squareSize];
}

function handleBoardPress(x: number, y: number) {
  const g = GameState.peek();
  const p = g.proposed;
  if (!p.pieceId) {
    return;
  }
  const piece = g.pieces.find((pc) => pc.id === p.pieceId)!;
  if (piece.type === 'Knight') {
    return;
  }

  const dir = piece.availableDirections(g);
  const start = piece.position;
  const end = new Position(x, y);
  const pressedDir = Position.getDirection(start, end);
  if (dir.includes(pressedDir)) {
    GameState.proposed.direction.set(pressedDir);
    const maxMove = piece.getMaximumMoveWithCollision(g, pressedDir);
    const move = nearestPoint(piece.position, maxMove, end);
    const maxD = piece.position.squareDistance(maxMove);
    const moveD = piece.position.squareDistance(move);
    const perc = Math.sqrt(moveD) / Math.sqrt(maxD);
    setMoveScale(Math.max(0, Math.min(1, perc)));
  }
}

export const Board = observer(
  ({ size, top, left }: { size: number; top: number; left: number }) => {
    const { theme } = useTheme();
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });
    const useBg = GameSettings.boardSettings.background.get() === 'default';

    const onPiecePress = React.useCallback((piece: Observable<Piece>) => {
      const game = GameState.peek();
      if (game.whiteToMove === piece.black.get()) {
        return;
      }
      proposePiece(piece);
    }, []);

    const selectedPiece = GameState.proposed.pieceId.get();

    const boardProps = React.useMemo(() => {
      const pressHandler = (event: any) => {
        if (GameState.peek().proposed.pieceId) {
          const [x, y] = getBoardPosition(
            event.nativeEvent.pageX - offset.x,
            event.nativeEvent.pageY - offset.y,
            size,
            GameState.size.peek(),
          );
          handleBoardPress(x, y);
        }
      };

      if (Platform.OS === 'web') {
        return {
          onPress: pressHandler,
        };
      }

      return {
        onTouchStart: pressHandler,
      };
    }, [offset]);

    return (
      <View
        ref={(view) => {
          if (!view) {
            return;
          }
          view.measureInWindow((x, y) => {
            if (x !== offset.x || y !== offset.y) {
              setOffset({ x, y });
            }
          });
        }}>
        <Pressable
          {...boardProps}
          style={{
            borderWidth: 2,
            borderColor: theme.colors.black,
            marginBottom: 10,
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
          <For<Piece, never> each={GameState.pieces}>
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
        </Pressable>
        <Status />
      </View>
    );
  },
);

Board.whyDidYouRender = true;
