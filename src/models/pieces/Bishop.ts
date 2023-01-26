import { GameState } from "../../state";
import { Direction, Piece } from "../Piece";
import { Position } from "../Position";

export class Bishop extends Piece {
  constructor(black: boolean, position: Position) {
    super(black, 'Bishop', position);
  }

  availableDirections(state: GameState): Direction[] {
    return this.filterForBounds(['NE', 'NW', 'SE', 'SW'], state.size.get());
  }

  getMaximumMove(state: GameState, direction: Direction): Position {
    return this.position;
  }
}