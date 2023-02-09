import { Piece } from '../models/Piece';
import { Position } from '../models/Position';
import { Direction } from '../models/types';

export interface RawGameState {
  pieces: Piece[];
  allowAi: boolean;
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
  // Note that a castle is recorded as a king move to the
  // target position, which would be an invalid move otherwise.
  // So when applying the move, care needs to be taken to realize that
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
