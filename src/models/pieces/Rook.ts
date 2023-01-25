import { Direction, Piece } from "../Piece";
import { Position } from "../Position";

export class Rook extends Piece {
  constructor(black: boolean, position: Position) {
    super(black, 'Rook', position);
  }

  availableDirections(): Direction[] {
    return ['E', 'W', 'N', 'S'];
  }
}