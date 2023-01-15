
export class Position {
  constructor(public x: number, public y: number) {}

  squareDistance(other: Position) {
    return Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2);
  }

  toString() {
    return `${this.x}, ${this.y}`;
  }
}
