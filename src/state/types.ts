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
    opponentName: string | undefined;
  };
  dead: Piece[];
  whiteToMove: boolean;
  gameOver: boolean;
  size: number;
}

export interface GameHistory {
  id?: string;
  name: string;
  white: string;
  black: string;
  over: boolean;
  moves: GameMove[];
}

export interface GameMove {
  id: string;
  // Piece id
  p: string;
  d: Direction;
  to: [number, number];
  // Time
  t?: number;
}

export interface FirebaseGameDocument {
  s: number;
  w?: string;
  b?: string;
  wn?: string;
  bn?: string;
  o?: boolean;
  m: Record<number, Omit<GameMove, 'id'>>;
}
