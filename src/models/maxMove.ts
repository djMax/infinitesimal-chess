import { Position } from './Position';
import { Direction } from './types';
import { RawGameState } from '../state/types';

export function maxMove(
  position: Position,
  radius: number,
  state: RawGameState,
  direction: Direction,
) {
  const boardSize = state.size;
  const southMoveLimit = position.y - radius;
  const northMoveLimit = boardSize - radius - position.y;
  const eastMoveLimit = boardSize - radius - position.x;
  const westMoveLimit = position.x - radius;

  const faredge = boardSize - radius;
  switch (direction) {
    case 'E':
      return new Position(faredge, position.y);
    case 'N':
      return new Position(position.x, faredge);
    case 'S':
      return new Position(position.x, radius);
    case 'W':
      return new Position(radius, position.y);
    case 'NE':
      if (northMoveLimit > eastMoveLimit) {
        return new Position(position.x + eastMoveLimit, position.y + eastMoveLimit);
      }
      return new Position(position.x + northMoveLimit, position.y + northMoveLimit);
    case 'SE':
      if (southMoveLimit > eastMoveLimit) {
        return new Position(position.x + eastMoveLimit, position.y - eastMoveLimit);
      }
      return new Position(position.x + southMoveLimit, position.y - southMoveLimit);
    case 'NW':
      if (northMoveLimit > westMoveLimit) {
        return new Position(position.x - westMoveLimit, position.y + westMoveLimit);
      }
      return new Position(position.x - northMoveLimit, position.y + northMoveLimit);
    case 'SW':
      if (southMoveLimit > westMoveLimit) {
        return new Position(position.x - westMoveLimit, position.y - westMoveLimit);
      }
      return new Position(position.x - southMoveLimit, position.y - southMoveLimit);
  }
}
