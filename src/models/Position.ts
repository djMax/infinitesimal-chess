import type { Direction } from "./Piece";

function sign(v: number) {
  return v > 0 ? 1 : -1;
}

const ANGLE_MAP: Record<string, Direction> = {
  '0': 'E',
  '45': 'NE',
  '90': 'N',
  '135': 'NW',
  '180': 'W',
  '-180': 'W',
  '-135': 'SW',
  '-90': 'S',
  '-45': 'SE',
};

export class Position {
  constructor(public x: number, public y: number) {}

  squareDistance(other: Position) {
    return Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2);
  }

  overlaps(other: Position, r1: number, r2: number) {
    return this.squareDistance(other) < (r1 + r2) * (r1 + r2);
  }

  add(other: Position | [number, number]) {
    if (Array.isArray(other)) {
      return new Position(this.x + other[0], this.y + other[1]);
    }
    return new Position(this.x + other.x, this.y + other.y);
  }

  toString() {
    return `${this.x}, ${this.y}`;
  }

  static maxLength(start: Position, end: Position, len: number) {
    // Set the maximum length of the line from start to end to be len
    const height = Math.abs(start.y - end.y);
    const width = Math.abs(start.x - end.x);
    if (start.x === end.x) {
      return new Position(end.x, start.y + Math.min(len, height) * sign(end.y - start.y));
    }
    if (start.y === end.y) {
      return new Position(start.x + Math.min(len, width) * sign(end.x - start.x), end.y);
    }

    const exLen = height * height + width * width;
    if (exLen <= len * len) {
      return end;
    }

    const progress = len / Math.sqrt(exLen);
    const newX = Math.floor((start.x + (end.x - start.x) * progress) * 100) / 100;
    const newY = Math.floor((start.y + (end.y - start.y) * progress) * 100) / 100;
    return new Position(newX, newY);
  }

  static interpolate(start: Position, end: Position, percentage: number) {
    const newX = Math.floor((start.x + (end.x - start.x) * percentage) * 100) / 100;
    const newY = Math.floor((start.y + (end.y - start.y) * percentage) * 100) / 100;
    return new Position(newX, newY);
  }

  static getDirection(start: Position, end: Position) {
    // Find the angle between start and end
    const angle = (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI;
    const rounded = Math.round(angle / 45) * 45;
    return ANGLE_MAP[rounded];
  }
}
