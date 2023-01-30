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
  };
  dead: Piece[];
  whiteToMove: boolean;
  gameOver: boolean;
  size: number;
}
