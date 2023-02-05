import { RawGameState } from '../../state/types';
import { Piece } from '../Piece';
import { Position } from '../Position';
import { Direction } from '../types';

export class Bishop extends Piece {
  constructor(black: boolean, position: Position, radius?: number) {
    super(black, 'Bishop', position, radius);
  }

  availableDirections(state: RawGameState): Direction[] {
    return this.filterForBounds(['NE', 'NW', 'SE', 'SW'], state.size);
  }

  copyWithMove<T extends Piece>(pos: Position, baseInstance?: Piece | undefined): T {
    return super.copyWithMove(pos, new Bishop(this.black, pos));
  }
}
