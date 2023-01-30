import { RawGameState } from '../../state/types';
import { Direction, Piece } from '../Piece';
import { Position } from '../Position';

const ROOT2 = Math.sqrt(2);

export class King extends Piece {
  constructor(black: boolean, position: Position) {
    super(black, 'King', position);
  }

  availableDirections(state: RawGameState): Direction[] {
    return this.filterForBounds(['E', 'N', 'S', 'W', 'NE', 'SE', 'NW', 'SW'], state.size);
  }

  getMaximumMove(state: RawGameState, direction: Direction): Position {
    const proposedEnd = super.getMaximumMove(state, direction);
    return Position.maxLength(this.position, proposedEnd, direction.length === 1 ? 1 : ROOT2);
  }
}
