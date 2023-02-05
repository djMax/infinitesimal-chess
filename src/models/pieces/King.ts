import { RawGameState } from '../../state/types';
import { Piece } from '../Piece';
import { Position } from '../Position';
import { AllDirections, Direction } from '../types';

const ROOT2 = Math.sqrt(2);

export class King extends Piece {
  constructor(black: boolean, position: Position, radius?: number) {
    super(black, 'King', position, radius);
  }

  availableDirections(state: RawGameState): Direction[] {
    return this.filterForBounds(AllDirections, state.size);
  }

  getMaximumMove(state: RawGameState, direction: Direction): Position {
    const proposedEnd = super.getMaximumMove(state, direction);
    return Position.maxLength(this.position, proposedEnd, direction.length === 1 ? 1 : ROOT2);
  }

  copyWithMove<T extends Piece>(pos: Position, baseInstance?: Piece | undefined): T {
    return super.copyWithMove(pos, new King(this.black, pos));
  }
}
