import type { RawGameState } from '../../state/types';
import { Direction, Piece } from '../Piece';
import { Position } from '../Position';

export class Queen extends Piece {
  constructor(black: boolean, position: Position, radius?: number) {
    super(black, 'Queen', position, radius);
  }

  availableDirections(state: RawGameState): Direction[] {
    return this.filterForBounds(['N', 'S', 'E', 'W', 'NE', 'SE', 'NW', 'SW'], state.size);
  }
}
