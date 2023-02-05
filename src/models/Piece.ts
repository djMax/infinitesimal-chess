import { Position } from './Position';
import { maxMove } from './maxMove';
import { Knight } from './pieces/Knight';
import { getOverlappingPieces, isOnLine } from './topology';
import { AllDirections, Direction, InvertedDirections, PieceType } from './types';
import type { RawGameState } from '../state/types';

const DEFAULT_RADIUS = 0.35;

interface Threat {
  piece: Piece;
  direction: Direction;
  variant?: string;
}

export class Piece {
  public history: Position[] = [];
  public id: string;
  // For the knight - either "1-2" or "2-1" type of thing
  public moveVariants: string[] = [];

  // In order to improve performance, we will store these calculated values
  // so that all pieces don't have to recompute them (and re-render) whenever
  // the piece moves. "Threatened" means if the proposed move is made, the
  // piece will be taken. "Can threaten" means if some move in the proposed
  // direction is made, the piece can be taken
  public threatened: boolean = false;
  public canThreaten: boolean = false;
  public proposedPositionWillBeThreatened: boolean = false;

  constructor(
    public black: boolean,
    public type: PieceType,
    public position: Position,
    public radius: number = DEFAULT_RADIUS,
  ) {
    if (['Bishop', 'Rook', 'Knight', 'Pawn'].includes(type)) {
      this.id = `${this.black ? 'B' : 'W'}${this.type}${Math.round(this.position.x + 0.5)}`;
    } else {
      this.id = `${this.black ? 'B' : 'W'}${this.type}`;
    }
  }

  /**
   * Get the available directions this piece can move in.
   */
  availableDirections(state: RawGameState): Direction[] {
    return [];
  }

  getMaximumMoveWithCollision(state: RawGameState, direction: Direction): Position {
    const end = this.getMaximumMove(state, direction);
    const overlap = getOverlappingPieces(this, end, state.pieces);
    if (overlap === undefined) {
      return end;
    }
    if (overlap.pieces[0].black === this.black) {
      return overlap.min;
    }
    return overlap.max;
  }

  /**
   * Get the point to which this piece can move in a given direction.
   * @param direction The direction to move.
   */
  getMaximumMove(state: RawGameState, direction: Direction): Position {
    return maxMove(this.position, this.radius, state, direction);
  }

  getScaledMove(
    state: RawGameState,
    direction: Direction,
    scale: number,
    variant?: string,
  ): Position {
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

  // Truth is this exists just for the Knight.
  // The other pieces "stop" before allowing invalid moves,
  // but the Knight can jump over, so needs this special handling.
  isValid(state: RawGameState, position: Position): boolean {
    return true;
  }

  canBeTaken(state: RawGameState, position: Position): Threat[] {
    const takers: Record<string, Threat> = {};
    const opponent = state.pieces.filter((p) => p.black !== this.black);
    AllDirections.forEach((direction) => {
      const rayEnd = maxMove(position, this.radius, state, direction);
      const candidates = getOverlappingPieces(this, rayEnd, opponent);
      candidates?.pieces
        .filter((p) => {
          if (p.type === 'Knight') {
            // We need to check this punk separately.
            return false;
          }
          const hasDirection = p.availableDirections(state).includes(direction);
          switch (p.type) {
            case 'Bishop':
            case 'Rook':
            case 'Queen':
              return hasDirection;
            case 'King':
            case 'Pawn':
              return hasDirection && position.squareDistance(p.position) < 2;
          }
        })
        .forEach((p) => {
          takers[p.id] = { piece: p, direction: InvertedDirections[direction] };
        });
      const knights = opponent.filter((p) => p.type === 'Knight') as Knight[];
      knights.forEach((k: Knight) => {
        // Find the first direction where the knight can take the target
        AllDirections.find((d) => {
          const { HV, VH } = k.getLines(d);
          if (isOnLine(HV, position, this.radius + k.radius)) {
            takers[k.id] = { piece: k, direction: d, variant: 'HV' };
            return true;
          }
          if (isOnLine(VH, position, this.radius + k.radius)) {
            takers[k.id] = { piece: k, direction: d, variant: 'VH' };
            return true;
          }
          return false;
        });
      });
    });
    return Object.values(takers);
  }
}
