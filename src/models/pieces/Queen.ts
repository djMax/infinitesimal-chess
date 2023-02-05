import type { RawGameState } from '../../state/types';
import { Piece } from '../Piece';
import { Position } from '../Position';
import { AllDirections, Direction } from '../types';

export class Queen extends Piece {
  constructor(black: boolean, position: Position, radius?: number) {
    super(black, 'Queen', position, radius);
  }

  availableDirections(state: RawGameState): Direction[] {
    return this.filterForBounds(AllDirections, state.size);
  }

  copyWithMove<T extends Piece>(pos: Position, baseInstance?: Piece | undefined): T {
    return super.copyWithMove(pos, new Queen(this.black, pos));
  }
}
