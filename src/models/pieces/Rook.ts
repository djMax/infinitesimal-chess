import type { RawGameState } from '../../state/types';
import { Piece } from '../Piece';
import { Position } from '../Position';
import { Direction } from '../types';

export class Rook extends Piece {
  constructor(black: boolean, position: Position, radius?: number) {
    super(black, 'Rook', position, radius);
  }

  availableDirections(state: RawGameState): Direction[] {
    return this.filterForBounds(['E', 'W', 'N', 'S'], state.size);
  }

  copyWithMove<T extends Piece>(pos: Position, baseInstance?: Piece | undefined): T {
    return super.copyWithMove(pos, new Rook(this.black, pos));
  }
}
