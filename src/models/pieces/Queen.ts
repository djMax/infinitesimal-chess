import { Direction, Piece } from "../Piece";
import { Position } from "../Position";

export class Queen extends Piece {
  availableDirections(): Direction[] {
    return [this.black ? 'S' : 'N'];
  }

  getMaximumMove(direction: Direction): Position {
    return this.position;
  }
}