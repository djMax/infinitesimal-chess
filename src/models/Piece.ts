import { Position } from "./Position";
import { GameState } from "../state/index"
import { getOverlappingPiece } from "./topology";


export type CardinalDirection = 'N' | 'S' | 'E' | 'W';

export type Direction = CardinalDirection | 'NE' | 'NW' | 'SE' | 'SW';

const DEFAULT_RADIUS = 0.35;

export type PieceType = 'King' | 'Queen' | 'Bishop' | 'Knight' | 'Rook' | 'Pawn';

export class Piece {
  public history: Position[] = [];
  public id: string;

  constructor(
    public black: boolean,
    public type: PieceType,
    public position: Position,
    public radius: number = DEFAULT_RADIUS,
  ) {
    this.id = `${this.black ? 'B' : 'W'}${this.type}${this.position.x - radius}}`
  }

  /**
   * Get the available directions this piece can move in.
   */
  availableDirections(): Direction[] {
    return [];
  }

  /**
   * Get the furthest point to which this piece can move in a given direction.
   * @param direction The direction to move.
   */
  getMaximumMove(direction: Direction, boardSize: number): Position {
    const southMoveLimit = this.position.y - this.radius;
    const northMoveLimit = boardSize - this.radius - this.position.y;
    const eastMoveLimit = boardSize - this.radius - this.position.x;
    const westMoveLimit = this.position.x - this.radius;

    const faredge = boardSize - this.radius;
    switch (direction) {
      case 'E':
        return new Position(faredge, this.position.y);
      case 'N':
        return new Position(this.position.x, faredge);
      case 'S':
        return new Position(this.position.x, this.radius);
      case 'W':
        return new Position(this.radius, this.position.y);
      case 'NE':
        if (northMoveLimit > eastMoveLimit) {
          return new Position(this.position.x + eastMoveLimit, this.position.y + eastMoveLimit);
        }
        return new Position(this.position.x + northMoveLimit, this.position.y + northMoveLimit);
      case 'SE':
        if (southMoveLimit > eastMoveLimit) {
          return new Position(this.position.x + eastMoveLimit, this.position.y - eastMoveLimit);
        }
        return new Position(this.position.x + southMoveLimit, this.position.y - southMoveLimit);
      case 'NW':
        if (northMoveLimit > westMoveLimit) {
          return new Position(this.position.x - westMoveLimit, this.position.y + westMoveLimit);
        }
        return new Position(this.position.x - northMoveLimit, this.position.y + northMoveLimit);
      case 'SW':
        if (southMoveLimit > westMoveLimit) {
          return new Position(this.position.x - westMoveLimit, this.position.y - westMoveLimit);
        }
        return new Position(this.position.x - southMoveLimit, this.position.y - southMoveLimit);
    }
  }

  limitToCollision(direction: Direction, state: typeof GameState): Piece {
    const trajectory = this.getMaximumMove(direction, state.size.get());
    const blackOverlapping = getOverlappingPiece(this, trajectory, state.board.black.get());
    const whiteOverlapping = getOverlappingPiece(this, trajectory, state.board.black.get());
    if (this.black) {
      if (blackOverlapping == undefined) {
        // (whiteOverlapping == undefined) ? trajectory :
      }
    }
  }

  toString() {
    return `${this.black ? 'Black' : 'White'} ${this.type} ${this.position.toString()}`;
  }
}
