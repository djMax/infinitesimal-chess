import { GameState, getAllPieces } from "../../state";
import { Direction, Piece } from "../Piece";
import { Position } from "../Position";
import { getOverlappingPiece } from '../topology';

const ROOT2 = Math.sqrt(2);

export class Pawn extends Piece {
  constructor(black: boolean, position: Position, radius?: number) {
    super(black, 'Pawn', position, radius);
  }

  availableDirections(state: GameState): Direction[] {
    return this.filterForBounds(
      this.black ? ['S', 'SW', 'SE'] : ['N', 'NW', 'NE'],
      state.size.get(),
    ).filter((d) => {
      if (d.length === 1) {
        return true;        
      }

      const end = this.getMaximumMove(state, d);
      const overlap = getOverlappingPiece(this, end, [...state.board.black, ...state.board.white]);
      console.log('overlapping piece', d, overlap?.piece.black !== this.black);
      return overlap?.piece && overlap.piece.black !== this.black;
    });
  }

  getMaximumMove(state: GameState, direction: Direction): Position {
    if (['S', 'N'].includes(direction)) {
      const isFirst = this.history.length === 0;
      const proposedEnd = super.getMaximumMove(state, direction);
      const finalPos = Position.maxLength(this.position, proposedEnd, isFirst ? 2 : 1);
      const overlap = getOverlappingPiece(this, finalPos, getAllPieces());
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