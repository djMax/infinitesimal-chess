import { RawGameState } from '../../state/types';
import { Direction, Piece } from '../Piece';
import { Position } from '../Position';
import { getPiecesOnLine } from '../topology';

const DELTAS: Record<Direction, [number, number]> = {
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
    // TODO this needs a "variant" to decide whether to move X first or Y first.
    // For now, we'll just move X first.
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
        new Position(
          newPos.x + (xIsFirst ? 0 : delta[0]),
          this.position.y + (xIsFirst ? delta[1] : 0),
        ),
        (scale - threshold) / (1 - threshold),
      );
    }
  }

  isValid(state: RawGameState, position: Position) {
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
}
