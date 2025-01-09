import { Vector } from "./vector";
import { Point } from "./point";

export class Face {
  vertices: Array<Point>;
  outer = true;
  constructor(vertices: Array<Point>) {
    this.vertices = vertices;
  }
  toString(): string {
    return `Face(${this.vertices[0]},${this.vertices[1]},${this.vertices[2]},${this.vertices[3]})`;
  }
  normal(): Vector {
    const v1 = this.vertices[0].subtract(this.vertices[1]);
    const v2 = this.vertices[0].subtract(this.vertices[2]);
    return v1.cross(v2);
  }
}
