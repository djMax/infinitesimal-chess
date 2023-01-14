import { Direction, Piece } from "../Piece";
import { Position } from "../Position";

export class King extends Piece {
  availableDirections(): Direction[] {
    return [this.black ? 'S' : 'N'];
  }

  getMaximumMove(direction: Direction): Position {
    return this.position;
  }
}