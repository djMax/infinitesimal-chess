import { Direction, Piece } from '../models/Piece';
import { Position } from '../models/Position';

export interface RawGameState {
  pieces: Piece[];
  proposed: {
    pieceId: string | undefined;
    direction: Direction | undefined;
    availableDirections: Direction[];
    distance: number;
    position: Position | undefined;
    valid: boolean;
    variant: string | undefined;
  };
  multiplayer: {
    gameId: string | undefined;
    isWhite: boolean;
  }
  dead: Piece[];
  whiteToMove: boolean;
  gameOver: boolean;
  size: number;
}

export interface GameHistory {
  gameId?: string;
  name: string;
  white: string;
  black: string;
  moves: {
    pieceId: string;
    direction: Direction;
    position: Position;
    time: number;
  }[];
}
