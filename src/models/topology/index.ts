import * as jsts from 'jsts';
import { Piece } from '../Piece';
import { Position } from "../Position";

const { buffer } = jsts.operation;
const { Coordinate } = jsts.geom;
const geo = new jsts.geom.GeometryFactory();

interface OverlappingPiece {
  min: Position;
  max: Position;
  piece: Piece;
}

function getStartAndEndOfOverlap(start: Piece, end: Position, target: Piece) {
  const enlargedPiece = geo
    .createPoint(new Coordinate(target.position.x, target.position.y))
    .buffer(target.radius + start.radius, 64, buffer.BufferParameters.CAP_ROUND);
  const sCoord = new Coordinate(start.position.x, start.position.y);
  const eCoord = new Coordinate(end.x, end.y);
  const l = geo.createLineString([sCoord, eCoord]);
  
  // Find out where l and enlargedPiece intersect
  const intersection = l.intersection(enlargedPiece); 
  console.log(intersection.getCoordinate);
  

}

function getMinMax(intersection: jsts.geom.Geometry): [Position, Position] {
  const coordinates = intersection.getCoordinates();
  const minMax = coordinates.reduce((acc, coord) => {
    if (coord.x < acc.min.x) {
      acc.min.x = coord.x;
    }
    if (coord.x > acc.max.x) {
      acc.max.x = coord.x;
    }
    if (coord.y < acc.min.y) {
      acc.min.y = coord.y;
    }
    if (coord.y > acc.max.y) {
      acc.max.y = coord.y;
    }
    return acc;
  }, { min: { x: Infinity, y: Infinity }, max: { x: -Infinity, y: -Infinity } });
  return [new Position(minMax.min.x, minMax.min.y), new Position(minMax.max.x, minMax.max.y)];
}

/**
 * Find the nearest piece in the list of pieces that overlaps with a move
 * from current position of p to end point.
 * @param p The moving piece
 * @param end The end point of the possible move
 * @param pieces The list of pieces that it might overlap with (excludes itself)
 * @returns
 */
export function getOverlappingPiece(p: Piece, end: Position, pieces: Piece[]): OverlappingPiece | undefined {
  const sortedOthers = pieces
    .filter((p2) => p2 !== p)
    .sort((a, b) => p.position.squareDistance(a.position) - p.position.squareDistance(b.position));
  const sCoord = new Coordinate(p.position.x, p.position.y);
  const eCoord = new Coordinate(end.x, end.y);
  const l = geo.createLineString([sCoord, eCoord]);
  const poly = l.buffer(p.radius, 64, buffer.BufferParameters.CAP_ROUND);

  let intersection: [Position, Position] | undefined;
  const firstPiece = sortedOthers.find((p) => {
    const pBuffer = geo
      .createPoint(new Coordinate(p.position.x, p.position.y))
      .buffer(p.radius, 64, buffer.BufferParameters.CAP_ROUND);
    if (pBuffer.intersects(poly)) {
      intersection = getMinMax(pBuffer.intersection(poly));
      return true;
    }
    return false;
  });

  if (intersection) {
    console.log('ENVELOPE', intersection);
    return { piece: firstPiece!, min: intersection[0], max: intersection[1] };
  }
  return undefined;
}

