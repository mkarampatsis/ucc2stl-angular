import { Coordinates } from "./coords";

export class Vector {
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
    return `Vector(${this.coordinates.x},${this.coordinates.y},${this.coordinates.z})`;
  }

  equals(other: Vector): boolean {
    return (
      this.coordinates.x === other.coordinates.x &&
      this.coordinates.y === other.coordinates.y &&
      this.coordinates.z === other.coordinates.z
    );
  }

  cross(other: Vector): Vector {
    return new Vector(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }
}
