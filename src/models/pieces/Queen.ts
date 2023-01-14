import { Direction, Piece } from "../Piece";
import { Position } from "../Position";

export class Queen extends Piece {
  constructor(black: boolean, position: Position) {
    super(black, 'Queen', position);
  }

  availableDirections(): Direction[] {
    return [this.black ? 'S' : 'N'];
  }

  getMaximumMove(direction: Direction): Position {
    return this.position;
  }
}