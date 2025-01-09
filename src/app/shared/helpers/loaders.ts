import { Point } from "./point";
import { Cuboid } from "./cuboid";
// import * as fs from "fs";

const EPSILON = 1.0e-5;

function csv2list(
  afile: string,
  atype: string,
  prepend_dummy = false
): number[][] {
  // const data = fs.readFileSync(afile, "utf8");
  console.log("LOADER>>>>>>");
  const data = "";
  const lines = data.split(/\r?\n/);
  const alist: number[][] = [];
  if (prepend_dummy) alist.push([0, 0, 0]);
  lines.forEach((line: string) => {
    const p: number[] = [];
    line
      .trim()
      .split(",")
      .forEach((e) => {
        if (atype === "int") {
          p.push(parseInt(e));
        } else {
          p.push(parseFloat(e));
        }
      });
    alist.push(p);
  });
  return alist;
}

export function txt2list(
  txt: string,
  atype: string,
  prepend_dummy = false
): number[][] {
  const alist: number[][] = [];
  const lines = txt.split(/\r?\n/);
  if (prepend_dummy) alist.push([0, 0, 0]);
  lines.forEach((line: string) => {
    const p: number[] = [];
    line
      .trim()
      .split(",")
      .forEach((e) => {
        if (atype === "int") {
          p.push(parseInt(e));
        } else {
          p.push(parseFloat(e));
        }
      });
    alist.push(p);
  });
  return alist;
}

export function dense_w_cuboids(
  _node: string,
  _connectivity: string,
  _density: string,
  threshhold: number
): Cuboid[] {
  const alist: Cuboid[] = [];
  const node = txt2list(_node, "int", true);
  const connectivity = txt2list(_connectivity, "float");
  const density = txt2list(_density, "float");
  const zip = density.map((cdensity, index) => [cdensity, connectivity[index]]);
  zip.forEach((element) => {
    if (element[0][0] - threshhold > EPSILON) {
      const vertices: Point[] = [];
      element[1].forEach((p) =>
        vertices.push(new Point(node[p][0], node[p][1], node[p][2]))
      );
      alist.push(new Cuboid(vertices));
    }
  });
  return alist;
}

export function dense_cuboids(
  nodes_file: string,
  connectivity_file: string,
  density_file: string,
  threshhold: number
): Cuboid[] {
  const alist: Cuboid[] = [];
  const nodes = csv2list(nodes_file, "int", true);
  const connectivity = csv2list(connectivity_file, "int");
  const density = csv2list(density_file, "float");
  const zip = density.map((cdensity, index) => [cdensity, connectivity[index]]);
  zip.forEach((element) => {
    if (element[0][0] - threshhold > EPSILON) {
      const vertices: Point[] = [];
      element[1].forEach((p) =>
        vertices.push(new Point(nodes[p][0], nodes[p][1], nodes[p][2]))
      );
      alist.push(new Cuboid(vertices));
    }
  });
  return alist;
}
