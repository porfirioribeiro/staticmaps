import { xToPx, yToPx, lonToX, latToY } from "./geo";
import { infinitBBox, bboxExtended } from "./utils";
import { LngLat, StaticMapCtx } from "./types";

export interface MultiPolygon {
  coords: LngLat[][][];
  fill?: string;
  fillOpacity?: number | string;
  fillRule?: "nonzero" | "evenodd" | "inherit";
  stroke?: string;
  strokeDasharray?: string | number;
  strokeDashoffset?: string | number;
  strokeLinecap?: "butt" | "round" | "square" | "inherit";
  strokeLinejoin?: "miter" | "round" | "bevel" | "inherit";
  strokeMiterlimit?: number | string;
  strokeOpacity?: number | string;
  strokeWidth?: number | string;
}

export interface RenderedMultiPolygon extends Omit<MultiPolygon, "coords"> {
  d: string;
}

export function extentMultyPolygon(p: MultiPolygon) {
  let bbox = infinitBBox;
  eachLatLngOfMultiPolygon(p, (ll) => bbox = bboxExtended(bbox, ll));
  return bbox;
}

export function eachLatLngOfMultiPolygon(
  { coords }: MultiPolygon,
  callback: (ll: LngLat) => void,
) {
  for (let j = 0; j < coords.length; j++) {
    for (let k = 0; k < coords[j].length; k++) {
      for (let l = 0; l < coords[j][k].length - 1; l++) {
        callback(coords[j][k][l]);
      }
    }
  }
}

/**
  * Render MultiPolygon to SVG
  */
export function multipolygonToPath(
  map: StaticMapCtx,
  { coords, ...mp }: MultiPolygon,
): RenderedMultiPolygon {
  const shapeArrays = coords.map((poly) =>
    poly.map((ll) =>
      ll.map((coord) => [
        xToPx(map, lonToX(coord[0], map.zoom)),
        yToPx(map, latToY(coord[1], map.zoom)),
      ])
    ).flat()
  );

  const pathArrays = shapeArrays.map((points) => {
    const startPoint = points.shift()!;

    const pathParts = [
      `M ${startPoint[0]} ${startPoint[1]}`,
      ...points.map((p) => `L ${p[0]} ${p[1]}`),
      "Z",
    ];

    return pathParts.join(" ");
  });

  return { ...mp, d: pathArrays.join(" ") };
}
