import { RawGameState } from '../../state/types';
import { Direction, Piece } from '../Piece';
import { Position } from '../Position';
import { getPiecesOnLine, nearestPoint } from '../topology';

export const DELTAS: Record<Direction, [number, number]> = {
  N: [1, 2],
  NE: [2, 1],
  E: [2, -1],
  SE: [1, -2],
  S: [-1, -2],
  SW: [-2, -1],
  W: [-2, 1],
  NW: [-1, 2],
};

// This is an "overpowered knight" as it can move
// in essentially a cloud of sqrt(5) around its starting point.
// TODO create another Knight class that is limited to sqrt(5) moves
export class Knight extends Piece {
  constructor(black: boolean, position: Position) {
    super(black, 'Knight', position);
    this.moveVariants = ['HV', 'VH'];
  }

  getEndPoint(direction: Direction) {
    return this.position.add(DELTAS[direction]);
  }

  availableDirections(state: RawGameState): Direction[] {
    // For the Knight, we MUST be able to move to the final point
    // (given board dimensions) to consider the move valid. Even if
    // landing at that point is impossible because it's occupied by our own piece
    const r = this.radius;
    const max = state.size - r;
    return (['N', 'S', 'E', 'W', 'NE', 'NW', 'SW', 'SE'] as Direction[]).filter((d) => {
      const end = this.getEndPoint(d);
      return end.x > r && end.x < max && end.y > r && end.y < max;
    });
  }

  getMaximumMove(state: RawGameState, direction: Direction): Position {
    // The Knight is special because it doesn't care if it is blocked or not.
    // However, it can't land such that it overlaps another piece of the same color.
    return this.getEndPoint(direction);
  }

  getScaledMove(
    state: RawGameState,
    direction: Direction,
    scale: number,
    variant: string,
  ): Position {
    const delta = DELTAS[direction];
    const xIsFirst = variant !== 'VH';
    const threshold = xIsFirst
      ? Math.abs(delta[0]) === 2
        ? 0.66
        : 0.33
      : Math.abs(delta[1]) === 2
      ? 0.66
      : 0.33;
    if (scale <= threshold) {
      // We are doing the "first thing"
      return Position.interpolate(
        this.position,
        new Position(
          this.position.x + (xIsFirst ? delta[0] : 0),
          this.position.y + (xIsFirst ? 0 : delta[1]),
        ),
        scale / threshold,
      );
    } else {
      // We are doing the "second thing", which requires the first to be done first
      const newPos = new Position(
        this.position.x + (xIsFirst ? delta[0] : 0),
        this.position.y + (xIsFirst ? 0 : delta[1]),
      );
      return Position.interpolate(
        newPos,
        this.position.add(delta),
        (scale - threshold) / (1 - threshold),
      );
    }
  }

  isValid(state: RawGameState, position: Position): boolean {
    // Is our piece within range?
    return !state.pieces.find(
      (other) =>
        other.black === this.black &&
        other !== this &&
        other.position.overlaps(position, other.radius, this.radius),
    );
  }

  getTargets(dir: Direction, state: RawGameState) {
    const delta = DELTAS[dir];
    const l1 = getPiecesOnLine(
      [this.position, this.position.add([delta[0], 0]), this.position.add(delta)],
      this.radius,
      state.pieces,
    );
    const l2 = getPiecesOnLine(
      [this.position, this.position.add([0, delta[1]]), this.position.add(delta)],
      this.radius,
      state.pieces,
    );
    const union = [...new Set([...l1, ...l2])];
    return { pieces: union };
  }

  getScaleToNearestPoint(dir: Direction, variant: string, point: Position) {
    const p1 = this.position;
    const xIsFirst = variant !== 'VH';
    const p2 = this.position.add([xIsFirst ? DELTAS[dir][0] : 0, xIsFirst ? 0 : DELTAS[dir][1]]);
    const p3 = this.position.add(DELTAS[dir]);

    const toL1 = nearestPoint(p1, p2, point);
    const toL2 = nearestPoint(p2, p3, point);

    let scale: number;
    const firstIs2 = xIsFirst ? Math.abs(DELTAS[dir][0]) === 2 : Math.abs(DELTAS[dir][1]) === 2;
    if (point.squareDistance(toL1) < point.squareDistance(toL2)) {
      const maxD = p1.squareDistance(p2);
      const moveD = p1.squareDistance(toL1);
      scale = Math.sqrt(moveD) / Math.sqrt(maxD) / (firstIs2 ? 2 : 3);
    } else {
      const maxD = p2.squareDistance(p3);
      const moveD = p2.squareDistance(toL2);
      scale = Math.sqrt(moveD) / Math.sqrt(maxD) / (firstIs2 ? 3 : 2) + (firstIs2 ? 0.66 : 0.33);
    }
    return Math.max(0, Math.min(1, scale));
  }

  static getKnightMove(from: Position, to: Position): [Direction, string] | undefined {
    const isSouth = from.y > to.y;
    const isWest = from.x > to.x;
    const vDist = Math.abs(from.y - to.y);
    const hDist = Math.abs(from.x - to.x);
    if (from.x === to.x) {
      // This is a partial move along one axis. Assume it is a v-first move
      // because why not.
      if (isSouth) {
        return ['SE', 'VH'];
      }
      return ['NE', 'VH'];
    }
    if (from.y === to.y) {
      // This is a partial move along one axis. Assume it is a h-first move
      // because why not.
      if (isWest) {
        return ['SW', 'HV'];
      }
      return ['NE', 'HV'];
    }

    // Ok, this is a move along two axes. So the first direction MUST
    // be completed.
    const variant = vDist > hDist ? 'VH' : 'HV';
    const dir = Object.entries(DELTAS).find(([dir, delta]) => {
      if (hDist > vDist !== Math.abs(delta[0]) > Math.abs(delta[1])) {
        return false;
      }
      if (vDist > hDist) {
        // y distance must agree
        if (delta[1] !== to.y - from.y) {
          return false;
        }
        // sign of x distance must agree
        return (to.x - from.x) * delta[0] > 0;
      }
      // x distance must agree
      if (delta[0] !== to.x - from.x) {
        return false;
      }
      // sign of y distance must agree
      return (to.y - from.y) * delta[1] > 0;
    })?.[0];
    if (!dir) {
      return undefined;
    }
    return [dir as Direction, variant];
  }

  static getDelta(direction: Direction) {
    return DELTAS[direction];
  }
}
