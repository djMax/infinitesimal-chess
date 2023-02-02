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
    moveCount: number;
  };
  dead: Piece[];
  whiteToMove: boolean;
  gameOver: boolean;
  size: number;
}

export interface GameMove {
  id: string;
  pieceId: string;
  direction: Direction;
  position: [number, number];
  time?: number;
};

export interface GameHistory {
  id?: string;
  name: string;
  white: string;
  black: string;
  over: boolean;
  moves: GameMove[];
}

export interface FirebaseGameDocument {
  start: number;
  white?: string;
  black?: string;
  over?: boolean;
  moves: Record<number, Omit<GameMove, 'id'>>;
}
