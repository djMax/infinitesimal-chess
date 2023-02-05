import { RawGameState } from '../../state/types';
import { Piece } from '../Piece';
import { Position } from '../Position';
import { Direction } from '../types';

export class Bishop extends Piece {
  constructor(black: boolean, position: Position) {
    super(black, 'Bishop', position);
  }

  availableDirections(state: RawGameState): Direction[] {
    return this.filterForBounds(['NE', 'NW', 'SE', 'SW'], state.size);
  }
}
