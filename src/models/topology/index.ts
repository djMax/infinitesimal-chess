import * as jsts from 'jsts';
import { Piece } from '../Piece';
import { Position } from "../Position";

const { buffer } = jsts.operation;
const { Coordinate } = jsts.geom;
const geo = new jsts.geom.GeometryFactory();

/**
 * Find the nearest piece in the list of pieces that overlaps with a move
 * from current position of p to end point.
 * @param p The moving piece
 * @param end The end point of the possible move
 * @param pieces The list of pieces that it might overlap with (excludes itself)
 * @returns
 */
export function getOverlappingPiece(p: Piece, end: Position, pieces: Piece[]): Piece | undefined {
  const sortedOthers = pieces
    .filter((p2) => p2 !== p)
    .sort((a, b) => p.position.squareDistance(a.position) - p.position.squareDistance(b.position));
  const sCoord = new Coordinate(p.position.x, p.position.y);
  const eCoord = new Coordinate(end.x, end.y);
  const l = geo.createLineString([sCoord, eCoord]);
  const poly = l.buffer(p.radius, 64, buffer.BufferParameters.CAP_ROUND);

  return sortedOthers.find((p) => {
    const pBuffer = geo
      .createPoint(new Coordinate(p.position.x, p.position.y))
      .buffer(p.radius, 64, buffer.BufferParameters.CAP_ROUND);
    return pBuffer.intersects(poly);
  });
}
