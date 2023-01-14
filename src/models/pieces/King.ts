import { Direction, Piece } from "../Piece";
import { Position } from "../Position";

export class King extends Piece {
  constructor(black: boolean, position: Position) {
    super(black, 'King', position);
  }

  availableDirections(): Direction[] {
    return [this.black ? 'S' : 'N'];
  }

  getMaximumMove(direction: Direction): Position {
    return this.position;
  }
}