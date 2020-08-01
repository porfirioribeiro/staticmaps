import { eachLatLngOfMultiPolygon, MultiPolygon } from "./MultiPolygon";
import { StaticMapCtx, Tile } from "./types";
import geoutils from "./geo";
import { OverlayImage } from "./OverlayImage";

export const noop = <T>(x: T) => x;

export type LatLng = [number, number];
export type BBox = [number, number, number, number];

export const infinitBBox: BBox = [Infinity, Infinity, -Infinity, -Infinity];

export function bboxExtended(bbox: BBox, latlng: LatLng): BBox {
  return [
    Math.min(bbox[0], latlng[0]),
    Math.min(bbox[1], latlng[1]),
    Math.max(bbox[2], latlng[0]),
    Math.max(bbox[3], latlng[1]),
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

interface GetMapBBoxOptions {
  bbox?: BBox;
  multiPolygons?: MultiPolygon[];
  overlayImages?: OverlayImage[];
}

export function getMapBBox(
  { bbox = infinitBBox, multiPolygons, overlayImages }: GetMapBBoxOptions,
) {
  if (multiPolygons) {
    multiPolygons.forEach((mp) =>
      eachLatLngOfMultiPolygon(mp, (ll) => (bbox = bboxExtended(bbox, ll)))
    );
  }
  if (overlayImages) {
    overlayImages.forEach((oi) => bbox = bboxJoin(bbox, oi.bbox));
  }

  if (bbox === infinitBBox) {
    throw "Could not get the bbox of the map, add some shape or a bbox";
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
) {
  const { zoomRange, size } = op.tileProvider;
  const widthPad = (op.width - (op.padding[0] * 2));
  const heightPad = (op.height - (op.padding[1] * 2));

  for (let z = zoomRange.max; z >= zoomRange.min; z--) {
    const extent = op.bbox;
    const width =
      (geoutils.lonToX(extent[2], z) - geoutils.lonToX(extent[0], z)) * size;

    if (width > widthPad) continue;

    const height =
      (geoutils.latToY(extent[1], z) - geoutils.latToY(extent[3], z)) * size;

    if (height > heightPad) continue;

    const res = Math.abs(
      Math.min((widthPad / width), /*  / 2 */ (heightPad / height) /*  / 2 */),
    );

    return [z, /* + 1 */ res];
  }
  return [zoomRange.min, 1];
}

export function getCenter(bbox: BBox, zoom: number): [number, number] {
  return [
    geoutils.lonToX((bbox[0] + bbox[2]) / 2, zoom),
    geoutils.latToY((bbox[1] + bbox[3]) / 2, zoom),
  ];
}

export function getBaselayer(map: StaticMapCtx) {
  const { size, url, subdomains } = map.tileProvider;
  const xMin = Math.floor(map.center[0] - (0.5 * map.width / size));
  const yMin = Math.floor(map.center[1] - (0.5 * map.height / size));
  const xMax = Math.ceil(map.center[0] + (0.5 * map.width / size));
  const yMax = Math.ceil(map.center[1] + (0.5 * map.height / size));

  const result: Tile[] = [];

  for (let x = xMin; x < xMax; x++) {
    for (let y = yMin; y < yMax; y++) {
      // # x and y may have crossed the date line
      const maxTile = (2 ** map.zoom);
      const tileX = (x + maxTile) % maxTile;
      let tileY = (y + maxTile) % maxTile;
      if (map.tileProvider.reverseY) tileY = ((1 << map.zoom) - tileY) - 1;

      let tileUrl = url
        .replace("{z}", `${map.zoom}`)
        .replace("{x}", `${tileX}`)
        .replace("{y}", `${tileY}`);

      if (subdomains && subdomains.length > 0) {
        // replace subdomain with random domain from subdomains array
        tileUrl = tileUrl.replace(
          "{s}",
          subdomains[Math.floor(Math.random() * subdomains.length)],
        );
      }

      result.push({
        url: tileUrl,
        bbox: [
          xToPx(map, x),
          yToPx(map, y),
          xToPx(map, x + 1),
          yToPx(map, y + 1),
        ],
      });
    }
  }

  return result;
}

/**
  * transform tile number to pixel on image canvas
  */
export function xToPx(map: StaticMapCtx, x: number) {
  return Math.round(
    ((x - map.center[0]) * map.tileProvider.size) + (map.width / 2),
  );
}

/**
    * transform tile number to pixel on image canvas
    */
export function yToPx(map: StaticMapCtx, y: number) {
  return Math.round(
    ((y - map.center[1]) * map.tileProvider.size) + (map.height / 2),
  );
}
