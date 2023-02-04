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
    opponentName: string | undefined;
  };
  ai:
    | {
        level: number;
        isWhite: boolean;
      }
    | undefined;
  moveCount: number;
  halfMoveCount: number;
  // The current en passant position, if any
  enPassant: Position | undefined;
  // Keep a list of the dead pieces, not even sure why we might need it,
  // but will keep it
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
  v?: string;
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
