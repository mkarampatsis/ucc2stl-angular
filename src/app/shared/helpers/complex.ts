import { Point } from "./point";
import { Cuboid } from "./cuboid";
import { Vector } from "./vector";

export class CuboidComplex {
  cuboids = new Map<string, Cuboid>();
  vertices = new Map<string, boolean>();
  triangles: Array<Array<Point>> = [];
  stl = "solid lalakis";
  constructor(cuboids: Array<Cuboid>) {
    cuboids.forEach((cuboid) => {
      this.insert(cuboid);
    });
  }

  stl_facet(normal: Vector, triangle: Array<Point>): string {
    return `
facet normal ${normal.x} ${normal.y} ${normal.z}
 outer loop
  vertex ${triangle[0].x} ${triangle[0].y} ${triangle[0].z}
  vertex ${triangle[1].x} ${triangle[1].y} ${triangle[1].z}
  vertex ${triangle[2].x} ${triangle[2].y} ${triangle[2].z}
 endloop
endfacet`;
  }

  insert(cuboid: Cuboid) {
    const cuboid_id = cuboid.centroid.toString();
    this.cuboids.set(cuboid_id, cuboid);
    const x = cuboid.centroid.x;
    const y = cuboid.centroid.y;
    const z = cuboid.centroid.z;
    const top_id = new Point(x, y + 1, z).toString();
    const bottom_id = new Point(x, y - 1, z).toString();
    const west_id = new Point(x - 1, y, z).toString();
    const east_id = new Point(x + 1, y, z).toString();
    const north_id = new Point(x, y, z - 1).toString();
    const south_id = new Point(x, y, z + 1).toString();
    if (this.cuboids.has(top_id)) {
      this.cuboids.get(top_id)!.faces.get("bottom")!.outer = false;
      this.cuboids.get(cuboid_id)!.faces.get("top")!.outer = false;
    }
    if (this.cuboids.has(bottom_id)) {
      this.cuboids.get(bottom_id)!.faces.get("top")!.outer = false;
      this.cuboids.get(cuboid_id)!.faces.get("bottom")!.outer = false;
    }
    if (this.cuboids.has(west_id)) {
      this.cuboids.get(west_id)!.faces.get("east")!.outer = false;
      this.cuboids.get(cuboid_id)!.faces.get("west")!.outer = false;
    }
    if (this.cuboids.has(east_id)) {
      this.cuboids.get(east_id)!.faces.get("west")!.outer = false;
      this.cuboids.get(cuboid_id)!.faces.get("east")!.outer = false;
    }
    if (this.cuboids.has(north_id)) {
      this.cuboids.get(north_id)!.faces.get("south")!.outer = false;
      this.cuboids.get(cuboid_id)!.faces.get("north")!.outer = false;
    }
    if (this.cuboids.has(south_id)) {
      this.cuboids.get(south_id)!.faces.get("north")!.outer = false;
      this.cuboids.get(cuboid_id)!.faces.get("south")!.outer = false;
    }
  }

  shell() {
    this.cuboids.forEach((cuboid) => {
      cuboid.faces.forEach((face) => {
        const v = face.vertices;
        if (face.outer) {
          const normal = face.normal();
          const triangle1 = [v[0], v[1], v[2]];
          this.stl += this.stl_facet(normal, triangle1);
          this.triangles.push(triangle1);
          const triangle2 = [v[2], v[3], v[0]];
          this.stl += this.stl_facet(normal, triangle2);
          this.triangles.push(triangle2);
          v.forEach((vertex) => {
            this.vertices.set(vertex.toString(), true);
          });
        }
      });
    });
    this.stl += "endsolid lalakis";
  }
}
