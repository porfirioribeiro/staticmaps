/* eslint-disable no-continue, no-param-reassign */

import { lonToX, latToY } from './geo';
import { BBox, Position, StaticMapCtx, StaticMapOptions } from './types';
import { eachPositionOfPolygon } from './Polygon';
import { eachPositionOfLineString } from './LineString';

export const noop = <T>(x: T) => x;

export const infinityBBox: BBox = [Infinity, Infinity, -Infinity, -Infinity];

export const defaultZoomRange = { min: 1, max: 21 };
export const defaultSize = 256;

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
  const { zoomRange = defaultZoomRange, size = defaultSize } = op.tileProvider;
  const widthPad = op.width - op.padding[0] * 2;
  const heightPad = op.height - op.padding[1] * 2;
  let bbox = getMapBBox(op);
  for (let z = zoomRange.max; z >= zoomRange.min; z -= 1) {
    const width = (lonToX(bbox[2], z) - lonToX(bbox[0], z)) * size;

    if (width > widthPad) continue;

    const height = (latToY(bbox[1], z) - latToY(bbox[3], z)) * size;

    if (height > heightPad) continue;

    // const res = Math.abs(Math.min(widthPad / width, heightPad / height));

    return [z, 1 /* res */, bbox];
  }
  return [zoomRange.min, 1, bbox];
}

export function getCenter(bbox: BBox, zoom: number): [number, number] {
  return [lonToX((bbox[0] + bbox[2]) / 2, zoom), latToY((bbox[1] + bbox[3]) / 2, zoom)];
}
