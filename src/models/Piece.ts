import { Position } from "./Position";

export type CardinalDirection = 'N' | 'S' | 'E' | 'W';

export type Direction = CardinalDirection | 'NE' | 'NW' | 'SE' | 'SW';

const DEFAULT_RADIUS = 0.35;

export type PieceType = 'King' | 'Queen' | 'Bishop' | 'Knight' | 'Rook' | 'Pawn';

export class Piece {
  public history: Position[] = [];

  constructor(
    public black: boolean,
    public type: PieceType,
    public position: Position,
    public radius: number = DEFAULT_RADIUS,
  ) {}

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
  getMaximumMove(direction: Direction): Position {
    return this.position;
  }

  toString() {
    return `${this.black ? 'Black' : 'White'} ${this.type} ${this.position.toString()}`;
  }
}
