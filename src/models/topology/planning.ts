import { getOverlappingPieces, getPiecesOnLine } from './index';
import { RawGameState } from '../../state/types';
import { Piece } from '../Piece';
import { Position } from '../Position';
import { Knight } from '../pieces/Knight';
import { Direction } from '../types';

interface Threat {
  piece: Piece;
  direction: Direction;
  variant?: string;
}

/**
 * Given a piece and a new position, find all the pieces that can
 * threaten this piece in the new position.
 * @param state
 * @param piece
 * @param newPosition
 */
export function findThreats(state: RawGameState, piece: Piece, newPosition: Position): Threat[] {
  const newMe = piece.copyWithMove(newPosition);
  const notMe = state.pieces.filter((p) => p !== piece);
  notMe.push(newMe);

  const leftAfterMove = notMe.filter(
    (p) => p.sameTeam(piece) || !p.position.overlaps(newPosition, p.radius, piece.radius),
  );

  const modifiedState = {
    ...state,
    pieces: leftAfterMove,
  };

  /*
  const stats = {
    total: leftAfterMove.length,
    considered: 0,
    inRange: 0,
    directions: 0,
    elapsed: Date.now(),
  };
  */

  const threatDetail: Record<string, { direction: Direction; variant?: string }> = {};
  const potentialThreats = leftAfterMove.filter((p) => {
    if (p.sameTeam(newMe)) {
      return false;
    }
    // stats.considered += 1;
    if (p.type === 'Pawn' || p.type === 'King') {
      if (p.position.squareDistance(newPosition) > 2) {
        // No need to do more work
        return false;
      }
    }
    if (p.type === 'Knight' && p.position.squareDistance(newPosition) > 5) {
      // No need to do more work
      return false;
    }
    const opponentIsAbove = p.position.y > newPosition.y;
    const opponentIsRight = p.position.x > newPosition.x;

    // stats.inRange += 1;
    return p.availableDirections(modifiedState).some((dir) => {
      if (opponentIsAbove && dir[0] === 'N') {
        return false;
      }
      if (opponentIsRight && dir.includes('E')) {
        return false;
      }
      // stats.directions += 1;
      if (p instanceof Knight) {
        const { HV, VH } = p.getLines(dir);
        const l1 = getPiecesOnLine(HV, p.radius, leftAfterMove);
        if (l1.includes(newMe)) {
          threatDetail[p.id] = { direction: dir, variant: 'HV' };
          return true;
        }
        const l2 = getPiecesOnLine(VH, p.radius, leftAfterMove);
        if (l2.includes(newMe)) {
          threatDetail[p.id] = { direction: dir, variant: 'VH' };
          return true;
        }
      } else {
        const end = p.getMaximumMoveWithCollision(modifiedState, dir);
        const overlap = getOverlappingPieces(p, end, leftAfterMove)?.pieces;
        if (overlap?.includes(newMe)) {
          threatDetail[p.id] = { direction: dir };
          return true;
        }
      }
      return false;
    });
  });
  // stats.elapsed = Date.now() - stats.elapsed;
  // console.log('Stats', stats);
  return potentialThreats.map((p) => ({ piece: p, ...threatDetail[p.id] }));
}
