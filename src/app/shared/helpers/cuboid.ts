import { Point } from "./point";
import { Face } from "./face";

export class Cuboid {
  vertices: Array<Point>;
  faces = new Map<
    "top" | "bottom" | "north" | "south" | "east" | "west",
    Face
  >();
  constructor(vertices: Array<Point>) {
    this.vertices = vertices.sort();
    const v = this.vertices;
    this.faces.set("north", new Face([v[0], v[2], v[6], v[4]]));
    this.faces.set("south", new Face([v[1], v[5], v[7], v[3]]));
    this.faces.set("east", new Face([v[5], v[4], v[6], v[7]]));
    this.faces.set("west", new Face([v[0], v[1], v[3], v[2]]));
    this.faces.set("top", new Face([v[6], v[2], v[3], v[7]]));
    this.faces.set("bottom", new Face([v[0], v[4], v[5], v[1]]));
  }
  get centroid(): Point {
    let x = 0,
      y = 0,
      z = 0;
    this.vertices.forEach((vertex) => {
      x += vertex.x;
      y += vertex.y;
      z += vertex.z;
    });
    return new Point(x / 8, y / 8, z / 8);
  }
  equals(other: Cuboid): boolean {
    return this.centroid.equals(other.centroid);
  }
  isLessThan(other: Cuboid): boolean {
    return this.centroid.isLessThan(other.centroid);
  }
  isLessThanOrEqual(other: Cuboid): boolean {
    return this.centroid.isGreaterThanOrEqual(other.centroid);
  }
  isGreaterThan(other: Cuboid): boolean {
    return this.centroid.isGreaterThan(other.centroid);
  }
  isGreaterThanOrEqual(other: Cuboid): boolean {
    return this.centroid.isGreaterThanOrEqual(other.centroid);
  }
}
