import { Direction, Piece } from "../Piece";
import { Position } from "../Position";

const ROOT2 = Math.sqrt(2);

export class Pawn extends Piece {
  constructor(black: boolean, position: Position, radius?: number) {
    super(black, 'Pawn', position, radius);
  }

  availableDirections(): Direction[] {
    return this.black ? ['S', 'SW', 'SE'] : ['N', 'NW', 'NE'];
  }

  getMaximumMove(direction: Direction, boardSize: number): Position {
    if (['S', 'N'].includes(direction)) {
      const isFirst = this.history.length === 0;
      const proposedEnd = super.getMaximumMove(direction, boardSize);
      return Position.maxLength(this.position, proposedEnd, isFirst ? 2 : 1)
    }

    // Take move (diagonal) can move max of sqrt(2)
    const proposedEnd = super.getMaximumMove(direction, boardSize);
    return Position.maxLength(this.position, proposedEnd, ROOT2);
  }
}