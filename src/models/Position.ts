function sign(v: number) {
  return v > 0 ? 1 : -1;
}

export class Position {
  constructor(public x: number, public y: number) {}

  squareDistance(other: Position) {
    return Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2);
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
}
