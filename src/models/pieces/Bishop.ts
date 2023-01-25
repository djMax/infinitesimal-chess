import { Direction, Piece } from "../Piece";
import { Position } from "../Position";

export class Bishop extends Piece {
  constructor(black: boolean, position: Position) {
    super(black, 'Bishop', position);
  }

  availableDirections(): Direction[] {
    return ['NE', 'NW', 'SE', 'SW'];
  }

  getMaximumMove(direction: Direction): Position {
    return this.position;
  }
}