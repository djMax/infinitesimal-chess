import * as jsts from 'jsts';

import { Piece } from '../Piece';
import { Position } from '../Position';

const { Coordinate } = jsts.geom;
const geo = new jsts.geom.GeometryFactory();

interface OverlappingPiece {
  min: Position;
  max: Position;
  piece: Piece;
}

function getStartAndEndOfOverlap(attacker: Piece, line: jsts.geom.LineString, target: Piece) {
  const shapes = new (jsts as any).util.GeometricShapeFactory();
  shapes.setNumPoints(64);
  shapes.setCentre(new Coordinate(target.position.x, target.position.y));
  shapes.setSize((target.radius + attacker.radius) * 2);
  const enlargedPiece = shapes.createCircle();
  // Find out where l and enlargedPiece intersect
  const intersection = line.intersection(enlargedPiece);
  if (intersection.getNumPoints() < 2) {
    return undefined;
  }

  const mapped = intersection
    .getCoordinates()
    .map((c) => ({
      at: new Position(c.x, c.y),
      dist: attacker.position.squareDistance(new Position(c.x, c.y)),
    }))
    .sort((a, b) => a.dist - b.dist);
  return { start: mapped[0].at, end: mapped[1].at };
}

/**
 * Find the nearest piece in the list of pieces that overlaps with a move
 * from current position of p to end point.
 * @param p The moving piece
 * @param end The end point of the possible move
 * @param pieces The list of pieces that it might overlap with (excludes itself)
 * @returns
 */
export function getOverlappingPiece(
  p: Piece,
  end: Position,
  pieces: Piece[],
): OverlappingPiece | undefined {
  const sortedOthers = pieces
    .filter((p2) => p2 !== p)
    .sort((a, b) => p.position.squareDistance(a.position) - p.position.squareDistance(b.position));
  const sCoord = new Coordinate(p.position.x, p.position.y);
  const eCoord = new Coordinate(end.x, end.y);
  const l = geo.createLineString([sCoord, eCoord]);

  const overlaps: OverlappingPiece[] = [];
  for (let i = 0; i < sortedOthers.length; i++) {
    const other = sortedOthers[i];
    const intersection = getStartAndEndOfOverlap(p, l, other);
    if (intersection) {
      overlaps.push({ piece: other, min: intersection.start, max: intersection.end });
    }
    if (overlaps.length === 2) {
      // If the piece BEHIND the overlapping one is the same color, but the first is not,
      // we have to make sure the min of the second piece is not before the max of the first
      if (p.black !== overlaps[0].piece.black && p.black === overlaps[1].piece.black) {
        return {
          piece: overlaps[0].piece,
          min: overlaps[0].min,
          max: [overlaps[0].max, overlaps[1].min].sort(
            (a, b) => a.squareDistance(p.position) - b.squareDistance(p.position),
          )[0],
        };
      }
    }
  }

  return overlaps[0];
}
