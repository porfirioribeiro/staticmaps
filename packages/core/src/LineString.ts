import { Position, StaticMapCtx } from './types';
import { lonToMapX, lonToMapY } from './geo';
import { infinitBBox, bboxExtended } from './utils';

type CoordsLineString = Position[];

export interface LineString {
  coords: CoordsLineString | CoordsLineString[];
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
  eachPositionOfLineString(p, ll => (bbox = bboxExtended(bbox, ll)));
  return bbox;
}

export function eachPositionOfLineString({ coords }: LineString, callback: (ll: Position) => void) {
  const c = fixCoords(coords);
  for (let j = 0; j < c.length; j += 1) {
    for (let k = 0; k < c[j].length; k += 1) {
      callback(c[j][k]);
    }
  }
}

const pointsToPathPart = (map: StaticMapCtx, [startPoint, ...points]: Position[]): string =>
  [
    `M ${lonToMapX(map, startPoint[0])} ${lonToMapY(map, startPoint[1])}`,
    ...points.map(ll => `L ${lonToMapX(map, ll[0])} ${lonToMapY(map, ll[1])}`),
  ].join(' ');

/**
 * Render LineString to SVG
 */
export function processLineString(map: StaticMapCtx, ls: LineString): RenderedLineString {
  const out = Object.assign(
    {
      d: fixCoords(ls.coords)
        .map(c => pointsToPathPart(map, c))
        .join(' '),
    },
    ls,
  );
  delete (out as any).coords;
  return out;
}

const fixCoords = (coords: CoordsLineString | CoordsLineString[]) =>
  !Array.isArray(coords[0][0]) ? [coords as CoordsLineString] : (coords as CoordsLineString[]);
