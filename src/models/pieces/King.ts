import { GameState } from "../../state";
import { Direction, Piece } from "../Piece";
import { Position } from "../Position";

export class King extends Piece {
  constructor(black: boolean, position: Position) {
    super(black, 'King', position);
  }

  availableDirections(state: GameState): Direction[] {
    return this.filterForBounds(['E', 'N', 'S', 'W', 'NE', 'SE', 'NW', 'SW'], state.size.get());
  }
}