import type { RawGameState } from '../../state/types';
import { Direction, Piece } from '../Piece';
import { Position } from '../Position';

export class Rook extends Piece {
  constructor(black: boolean, position: Position) {
    super(black, 'Rook', position);
  }

  availableDirections(state: RawGameState): Direction[] {
    return this.filterForBounds(['E', 'W', 'N', 'S'], state.size);
  }
}
