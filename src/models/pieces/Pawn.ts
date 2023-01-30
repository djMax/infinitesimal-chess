import type { RawGameState } from '../../state/types';
import { Direction, Piece } from '../Piece';
import { Position } from '../Position';
import { getOverlappingPieces } from '../topology';

const ROOT2 = Math.sqrt(2);

export class Pawn extends Piece {
  constructor(black: boolean, position: Position, radius?: number) {
    super(black, 'Pawn', position, radius);
  }

  availableDirections(state: RawGameState): Direction[] {
    return this.filterForBounds(
      this.black ? ['S', 'SW', 'SE'] : ['N', 'NW', 'NE'],
      state.size,
    ).filter((d) => {
      if (d.length === 1) {
        return true;
      }

      const end = this.getMaximumMove(state, d);
      const overlap = getOverlappingPieces(this, end, state.pieces);
      return overlap && overlap.pieces[0].black !== this.black;
    });
  }

  getMaximumMove(state: RawGameState, direction: Direction): Position {
    if (['S', 'N'].includes(direction)) {
      const isFirst = this.history.length === 0;
      const proposedEnd = super.getMaximumMove(state, direction);
      const finalPos = Position.maxLength(this.position, proposedEnd, isFirst ? 2 : 1);
      const overlap = getOverlappingPieces(this, finalPos, state.pieces);
      if (overlap) {
        return overlap.min;
      }
      return finalPos;
    }

    // Take move (diagonal) can move max of sqrt(2)
    const proposedEnd = super.getMaximumMove(state, direction);
    return Position.maxLength(this.position, proposedEnd, ROOT2);
  }
}
