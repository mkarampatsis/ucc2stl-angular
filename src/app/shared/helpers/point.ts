import { Coordinates } from "./coords";
import { Vector } from "./vector";

export class Point {
  coordinates: Coordinates;

  constructor(x: number, y: number, z: number) {
    this.coordinates = new Coordinates(x, y, z);
  }

  get x(): number {
    return this.coordinates.x;
  }

  get y(): number {
    return this.coordinates.y;
  }

  get z(): number {
    return this.coordinates.z;
  }

  toString(): string {
    return `Point(${this.coordinates.x},${this.coordinates.y},${this.coordinates.z})`;
  }

  equals(other: Point): boolean {
    return (
      this.coordinates.x === other.coordinates.x &&
      this.coordinates.y === other.coordinates.y &&
      this.coordinates.z === other.coordinates.z
    );
  }

  isLessThan(other: Point): boolean {
    if (this.coordinates.x < other.coordinates.x) {
      return true;
    } else if (this.coordinates.y < other.coordinates.y) {
      return true;
    } else {
      return this.coordinates.z < other.coordinates.z;
    }
  }

  isGreaterThan(other: Point): boolean {
    return !this.isLessThan(other);
  }

  isLessThanOrEqual(other: Point): boolean {
    if (this.coordinates.x <= other.coordinates.x) {
      return true;
    } else if (this.coordinates.y <= other.coordinates.y) {
      return true;
    } else {
      return this.coordinates.z <= other.coordinates.z;
    }
  }

  isGreaterThanOrEqual(other: Point): boolean {
    return !this.isLessThanOrEqual(other);
  }

  subtract(other: Point): Vector {
    return new Vector(other.x - this.x, other.y - this.y, other.z - this.z);
  }

  add(vector: Vector): Point {
    return new Point(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }
}
