import { Position } from './Position';
import { getOverlappingPiece } from './topology';
import type { GameState } from '../state/index';

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
    this.id = `${this.black ? 'B' : 'W'}${this.type}${this.position.x - radius}}`;
  }

  /**
   * Get the available directions this piece can move in.
   */
  availableDirections(state: GameState): Direction[] {
    return [];
  }

  getMaximumMoveWithCollision(state: GameState, direction: Direction): Position {
    const end = this.getMaximumMove(state, direction);
    const overlap = getOverlappingPiece(this, end, [...state.board.black, ...state.board.white]);
    if (overlap == undefined) {
      return end;
    }
    if (overlap.piece.black == this.black) {
      return overlap.min;
    }
    return overlap.max;
  }

  /**
   * Get the point to which this piece can move in a given direction.
   * @param direction The direction to move.
   */
  getMaximumMove(state: GameState, direction: Direction): Position {
    const boardSize = state.size.get();
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

  getScaledMove(state: GameState, direction: Direction, scale: number): Position {
    const maxMove = this.getMaximumMoveWithCollision(state, direction);
    return Position.interpolate(this.position, maxMove, scale);
  }

  toString() {
    return `${this.black ? 'Black' : 'White'} ${this.type} ${this.position.toString()}`;
  }

  filterForBounds(directions: Direction[], size: number) {
    return directions.filter((direction) => {
      return direction.split('').every((cardinal) => {
        switch (cardinal) {
          case 'E':
            return this.position.x < size - this.radius;
          case 'W':
            return this.position.x > this.radius;
          case 'N':
            return this.position.y < size - this.radius;
          case 'S':
            return this.position.y > this.radius;
        }
      });
    });
  }
}
