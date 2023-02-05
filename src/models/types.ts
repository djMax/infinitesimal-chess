export type CardinalDirection = 'N' | 'S' | 'E' | 'W';

export type Direction = CardinalDirection | 'NE' | 'NW' | 'SE' | 'SW';

export const AllDirections: Direction[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export type PieceType = 'King' | 'Queen' | 'Bishop' | 'Knight' | 'Rook' | 'Pawn';

export const InvertedDirections: Record<Direction, Direction> = {
  N: 'S',
  S: 'N',
  E: 'W',
  W: 'E',
  NE: 'SW',
  NW: 'SE',
  SE: 'NW',
  SW: 'NE',
};
