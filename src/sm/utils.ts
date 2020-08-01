import { eachLatLngOfMultiPolygon } from "./MultiPolygon";
import { StaticMapCtx, StaticMapProps, BBox, LngLat } from "./types";
import { lonToX, latToY, xToLon, yToLat, xToPx, yToPx } from "./geo";
import { extentOfMarker } from "./Marker";

export const noop = <T>(x: T) => x;

export const infinitBBox: BBox = [Infinity, Infinity, -Infinity, -Infinity];

export function bboxExtended(bbox: BBox, [lng, lat]: LngLat): BBox {
  return [
    Math.min(bbox[0], lng),
    Math.min(bbox[1], lat),
    Math.max(bbox[2], lng),
    Math.max(bbox[3], lat),
  ];
}

export function bboxJoin(bbox1: BBox, bbox2: BBox): BBox {
  return [
    Math.min(bbox1[0], bbox2[0]),
    Math.min(bbox1[1], bbox2[1]),
    Math.max(bbox1[2], bbox2[2]),
    Math.max(bbox1[3], bbox2[3]),
  ];
}

export function getMapBBox(
  { bbox = infinitBBox, multiPolygons, overlayImages, markers, tileProvider }:
    StaticMapProps,
  zoom?: number,
) {
  if (multiPolygons) {
    multiPolygons.forEach((mp) =>
      eachLatLngOfMultiPolygon(mp, (ll) => (bbox = bboxExtended(bbox, ll)))
    );
  }
  if (overlayImages) {
    overlayImages.forEach((oi) => bbox = bboxJoin(bbox, oi.bbox));
  }

  if (markers) {
    if (!zoom) {
      markers.forEach((m) => bbox = bboxExtended(bbox, m.coord));
    } else {
      markers.forEach((m) => {
        // # consider dimension of marker
        const [offsetX, offsetY] = extentOfMarker(m);

        const ePx = [
          offsetX,
          (m.height - offsetY),
          (m.width - offsetX),
          offsetY,
        ];

        const x = lonToX(m.coord[0], zoom);
        const y = latToY(m.coord[1], zoom);

        bbox = bboxJoin(bbox, [
          xToLon(x - ePx[0] / tileProvider!.size, zoom),
          yToLat(y + ePx[1] / tileProvider!.size, zoom),
          xToLon(x + ePx[0] / tileProvider!.size, zoom),
          yToLat(y - ePx[3] / tileProvider!.size, zoom),
        ]);
      });
    }
  }

  if (bbox === infinitBBox) {
    throw new Error(
      "Could not get the bbox of the map, add some shape or a bbox",
    );
  }

  return bbox;
}

/**
    * calculate the best zoom level for given extent
    */
export function calculateZoom(
  op: Pick<
    StaticMapCtx,
    | "bbox"
    | "width"
    | "height"
    | "padding"
    | "tileProvider"
  >,
): [number, number, BBox] {
  const { zoomRange, size } = op.tileProvider;
  const widthPad = (op.width - (op.padding[0] * 2));
  const heightPad = (op.height - (op.padding[1] * 2));
  let bbox = op.bbox;
  for (let z = zoomRange.max; z >= zoomRange.min; z--) {
    bbox = getMapBBox(op, z);
    const width = (lonToX(bbox[2], z) - lonToX(bbox[0], z)) *
      size;

    if (width > widthPad) continue;

    const height = (latToY(bbox[1], z) - latToY(bbox[3], z)) *
      size;

    if (height > heightPad) continue;

    const res = Math.abs(
      Math.min((widthPad / width), (heightPad / height)),
    );

    return [z, res, bbox];
  }
  return [zoomRange.min, 1, bbox];
}

export function getCenter(bbox: BBox, zoom: number): [number, number] {
  return [
    lonToX((bbox[0] + bbox[2]) / 2, zoom),
    latToY((bbox[1] + bbox[3]) / 2, zoom),
  ];
}
