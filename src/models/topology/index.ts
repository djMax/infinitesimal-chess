import * as jsts from 'jsts';

import { Piece } from '../Piece';
import { Position } from '../Position';

const { Coordinate, LineSegment } = jsts.geom;
const geo = new jsts.geom.GeometryFactory();

interface OverlappingPieces {
  min: Position;
  max: Position;
  pieces: Piece[];
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
  if (attacker.black !== target.black) {
    // Set the max to the point on the line nearest the center of the target
    const pt = geo.createPoint(new Coordinate(target.position.x, target.position.y));
    const dOp = new jsts.operation.distance.DistanceOp(line, pt);
    const end = dOp.nearestPoints();
    return { start: mapped[0].at, end: new Position(end[0].x, end[0].y) };
  }
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
export function getOverlappingPieces(
  p: Piece,
  end: Position,
  pieces: Piece[],
): OverlappingPieces | undefined {
  const sortedOthers = pieces
    .filter((p2) => p2 !== p)
    .sort((a, b) => p.position.squareDistance(a.position) - p.position.squareDistance(b.position));
  const sCoord = new Coordinate(p.position.x, p.position.y);
  const eCoord = new Coordinate(end.x, end.y);
  const l = geo.createLineString([sCoord, eCoord]);

  const overlaps: OverlappingPieces[] = [];
  for (let i = 0; i < sortedOthers.length; i++) {
    const other = sortedOthers[i];
    const intersection = getStartAndEndOfOverlap(p, l, other);

    if (intersection && overlaps.length === 1) {
      // If the piece BEHIND the overlapping one is the same color, but the first is not,
      // we have to make sure the min of the second piece is not before the max of the first
      if (p.black !== overlaps[0].pieces[0].black && p.black === other.black) {
        return {
          pieces: overlaps[0].pieces,
          min: overlaps[0].min,
          max: [overlaps[0].max, intersection.start].sort(
            (a, b) => a.squareDistance(p.position) - b.squareDistance(p.position),
          )[0],
        };
      }
    }
    if (intersection && overlaps.length > 0) {
      // Ok, now this only matters if the second overlap can be taken by ending at the maximum
      // of the first overlap. The distance from the max of the first overlap to the min of the
      // current overlap must be less than the radius of the piece.
      if (intersection && overlaps[0].max.squareDistance(intersection!.end) < p.radius * p.radius) {
        overlaps[0].pieces.push(other);
      }
      // TODO shortcircuit if we are beyond the max of the first overlap
    } else if (intersection) {
      overlaps.push({ pieces: [other], min: intersection.start, max: intersection.end });
    }
  }

  return overlaps[0];
}

export function getPiecesOnLine(coords: Position[], radius: number, pieces: Piece[]) {
  const line = geo.createLineString(coords.map((c) => new Coordinate(c.x, c.y)));
  return pieces.filter((target) => {
    const shapes = new (jsts as any).util.GeometricShapeFactory();
    shapes.setNumPoints(64);
    shapes.setCentre(new Coordinate(target.position.x, target.position.y));
    shapes.setSize((target.radius + radius) * 2);
    const enlargedPiece = shapes.createCircle();
    // Find out where l and enlargedPiece intersect
    const intersection = line.intersection(enlargedPiece);
    return intersection.getNumPoints() >= 2;
  });
}

export function isOnLine(coords: Position[], pos: Position, radiusSum: number) {
  const line = geo.createLineString(coords.map((c) => new Coordinate(c.x, c.y)));
  const shapes = new (jsts as any).util.GeometricShapeFactory();
  shapes.setNumPoints(64);
  shapes.setCentre(new Coordinate(pos.x, pos.y));
  shapes.setSize(radiusSum * 2);
  const enlargedPiece = shapes.createCircle();
  // Find out where l and enlargedPiece intersect
  const intersection = line.intersection(enlargedPiece);
  return intersection.getNumPoints() >= 2;
}

export function nearestPoint(lineStart: Position, lineEnd: Position, point: Position) {
  const line = new LineSegment(
    new Coordinate(lineStart.x, lineStart.y),
    new Coordinate(lineEnd.x, lineEnd.y),
  );
  const p = new Coordinate(point.x, point.y);
  const nearest = line.closestPoint(p);
  return new Position(nearest.x, nearest.y);
}
