import { GameState } from "../../state";
import { Direction, Piece } from "../Piece";
import { Position } from "../Position";

export class Knight extends Piece {
  constructor(black: boolean, position: Position) {
    super(black, 'Knight', position);
  }

  availableDirections(state: GameState): Direction[] {
    return [this.black ? 'S' : 'N'];
  }
}