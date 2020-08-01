import geoutils from "./geo";

import { BBox, xToPx, yToPx } from "./utils";
import { StaticMapCtx } from "./types";

export interface OverlayImage {
  bbox: BBox;
  url: string;
}

export interface RenderedOverlayImage {
  href: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function processOverlayImage(
  map: StaticMapCtx,
  oi: OverlayImage,
): RenderedOverlayImage {
  const x = xToPx(map, geoutils.lonToX(oi.bbox[0], map.zoom));
  const y = yToPx(map, geoutils.latToY(oi.bbox[1], map.zoom));
  const width = xToPx(map, geoutils.lonToX(oi.bbox[2], map.zoom)) - x;
  const height = yToPx(map, geoutils.latToY(oi.bbox[3], map.zoom)) - y;
  return { href: oi.url, x, y, width, height };
}
