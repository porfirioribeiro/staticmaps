import { LngLat, StaticMapCtx } from './types';
import { xToPx, yToPx, lonToX, latToY, lonToMapX, lonToMapY } from './geo';
import { infinitBBox, bboxExtended } from './utils';

type CoordsLineString = LngLat[];

export interface LineString {
  coords: CoordsLineString;
  stroke?: string;
  strokeDasharray?: string | number;
  strokeDashoffset?: string | number;
  strokeLinecap?: 'butt' | 'round' | 'square' | 'inherit';
  strokeLinejoin?: 'miter' | 'round' | 'bevel' | 'inherit';
  strokeMiterlimit?: number | string;
  strokeOpacity?: number | string;
  strokeWidth?: number | string;
}

export interface RenderedLineString extends Omit<LineString, 'coords'> {
  d: string;
}

export function extentLineString(p: LineString) {
  let bbox = infinitBBox;
  eachLatLngOfLineString(p, ll => (bbox = bboxExtended(bbox, ll)));
  return bbox;
}

export function eachLatLngOfLineString({ coords }: LineString, callback: (ll: LngLat) => void) {
  for (let j = 0; j < coords.length; j += 1) {
    callback(coords[j]);
  }
}

const pointsToPathPart = (map: StaticMapCtx, [startPoint, ...points]: LngLat[]): string =>
  [
    `M ${lonToMapX(map, startPoint[0])} ${lonToMapY(map, startPoint[1])}`,
    ...points.map(ll => `L ${lonToMapX(map, ll[0])} ${lonToMapY(map, ll[1])}`),
  ].join(' ');

/**
 * Render LineString to SVG
 */
export function processLineString(map: StaticMapCtx, ls: LineString): RenderedLineString {
  const out = Object.assign({ d: pointsToPathPart(map, ls.coords) }, ls);
  delete (out as any).coords;
  return out;
}
