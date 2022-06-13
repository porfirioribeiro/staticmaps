/* eslint-disable no-continue, no-param-reassign */

import { lonToX, latToY } from './geo';
import { BBox, Padding, Point, Position, StaticMapCtx, StaticMapOptions, TileProvider, ZoomRange } from './types';
import { eachPositionOfPolygon } from './Polygon';
import { eachPositionOfLineString } from './LineString';

export const noop = <T>(x: T) => x;

export const infinityBBox: BBox = [Infinity, Infinity, -Infinity, -Infinity];

export const defaultZoomRange: ZoomRange = [1, 21];
export const defaultSize = 256;
export const defaultPadding: Padding = [0, 0];

export function bboxExtended(bbox: BBox, [lng, lat]: Position): BBox {
  return [Math.min(bbox[0], lng), Math.min(bbox[1], lat), Math.max(bbox[2], lng), Math.max(bbox[3], lat)];
}

export function bboxJoin(bbox1: BBox, bbox2: BBox): BBox {
  return [Math.min(bbox1[0], bbox2[0]), Math.min(bbox1[1], bbox2[1]), Math.max(bbox1[2], bbox2[2]), Math.max(bbox1[3], bbox2[3])];
}

export function getMapBBox({ bbox = infinityBBox, polygons, lineStrings, overlayImages, markers, tileProvider }: StaticMapOptions) {
  if (polygons) {
    polygons.forEach(mp => eachPositionOfPolygon(mp, ll => (bbox = bboxExtended(bbox, ll))));
  }
  if (lineStrings) {
    lineStrings.forEach(ls => eachPositionOfLineString(ls, ll => (bbox = bboxExtended(bbox, ll))));
  }
  if (overlayImages) {
    overlayImages.forEach(oi => (bbox = bboxJoin(bbox, oi.bbox)));
  }
  if (markers) {
    markers.forEach(m => (bbox = bboxExtended(bbox, m.coord)));
  }
  if (bbox === infinityBBox) {
    throw new Error('Could not get the bbox of the map, add some shape or a bbox');
  }

  return bbox;
}

/**
 * calculate the best zoom level for given extent
 */
export function calculateZoom(op: Pick<StaticMapCtx, 'bbox' | 'width' | 'height' | 'padding' | 'tileProvider'>): [number, number, BBox] {
  const { zoomRange: [zmin, zmax] = defaultZoomRange } = op.tileProvider;
  const size = defaultSize;
  const widthPad = op.width - op.padding[0] * 2;
  const heightPad = op.height - op.padding[1] * 2;
  let bbox = getMapBBox(op);
  for (let z = zmax; z >= zmin; z -= 1) {
    const w = (lonToX(bbox[2], z) - lonToX(bbox[0], z)) * size;

    if (w > widthPad) continue;

    const h = (latToY(bbox[1], z) - latToY(bbox[3], z)) * size;

    if (h > heightPad) continue;

    const res = Math.abs(Math.min(widthPad / w, heightPad / h));

    return [z, 1 /* res */, bbox];
  }
  return [zmin, 1, bbox];
}

/**
 *
 * @param bbox
 * @param width
 * @param height
 * @param padding
 * @param zoomRange
 * @param tileSize
 * @returns
 */
export function getZoomScale(
  bbox: BBox,
  width: number,
  height: number,
  [paddingX, paddingY] = defaultPadding,
  [zmin, zmax] = defaultZoomRange,
  tileSize = defaultSize,
): [zoom: number, scale: number] {
  const widthPad = width - paddingX * 2;
  const heightPad = height - paddingY * 2;
  for (let z = zmax; z >= zmin; z -= 1) {
    const w = (lonToX(bbox[2], z) - lonToX(bbox[0], z)) * tileSize;

    if (w > widthPad) continue;

    const h = (latToY(bbox[1], z) - latToY(bbox[3], z)) * tileSize;

    if (h > heightPad) continue;

    const res = Math.abs(Math.min(widthPad / w, heightPad / h));

    return [z, res];
  }
  return [zmin, 1];
}

export function getCenter(bbox: BBox, zoom: number): Point {
  return [lonToX((bbox[0] + bbox[2]) / 2, zoom), latToY((bbox[1] + bbox[3]) / 2, zoom)];
}

export function reduceZoomRange(tileProviders: TileProvider[]) {
  return tileProviders.reduce<ZoomRange>(
    (zoomRange, provider) =>
      provider.zoomRange //
        ? [Math.max(zoomRange[0], provider.zoomRange[0]), Math.min(zoomRange[1], provider.zoomRange[1])]
        : zoomRange,
    defaultZoomRange,
  );
}
