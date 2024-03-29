import { getOverlappingPieces, nearestPoint } from '.';
import { Position } from '../Position';
import { Pawn } from '../pieces/Pawn';
import { Queen } from '../pieces/Queen';

describe('topology', () => {
  it('should compute the points properly', () => {
    const queen = new Queen(false, new Position(3, 3), 0.5);
    const pawn = new Pawn(false, new Position(6, 3), 0.5);
    let qpoverlap = getOverlappingPieces(queen, new Position(8, 3), [pawn]);
    expect(qpoverlap?.pieces[0]).toEqual(pawn);
    expect(qpoverlap?.min.x).toEqual(5);
    expect(qpoverlap?.max.x).toEqual(7);

    queen.position = new Position(3, 3.9);
    qpoverlap = getOverlappingPieces(queen, new Position(8, 3.9), [pawn]);
    expect(qpoverlap?.pieces[0]).toEqual(pawn);
    // expect(qpoverlap?.min.toString()).toEqual(qpoverlap?.max.toString());

    queen.position = new Position(4, 1);
    qpoverlap = getOverlappingPieces(queen, new Position(7, 4), [pawn]);
    expect(qpoverlap?.pieces[0]).toEqual(pawn);
  });

  it('should find overlaps', () => {
    const queen = new Queen(false, new Position(0, 0));
    const pawn = new Pawn(false, new Position(4, 4));
    const pawn2 = new Pawn(false, new Position(5, 4));
    const pawn3 = new Pawn(false, new Position(5, 5));
    expect(getOverlappingPieces(queen, new Position(8, 8), [pawn])?.pieces[0]).toEqual(pawn);
    expect(getOverlappingPieces(queen, new Position(8, 8), [pawn2])?.pieces[0]).toEqual(undefined);
    expect(
      getOverlappingPieces(queen, new Position(8, 8), [pawn2, pawn3, pawn])?.pieces[0],
    ).toEqual(pawn);
  });

  it('should find the nearest point', () => {
    const nearest = nearestPoint(new Position(-10, 0), new Position(10, 0), new Position(0, 5));
    expect(nearest.toString()).toEqual('0, 0');
  });
});
