import { LngLat, StaticMapCtx } from './types';
import { xToPx, yToPx, lonToX, latToY } from './geo';
import { infinitBBox, bboxExtended } from './utils';

type CoordsLinearRing = LngLat[];
type CoordsPolygon = [exterior: CoordsLinearRing, ...holes: CoordsLinearRing[]];

export interface Polygon {
  coords: CoordsPolygon | CoordsPolygon[];
  fill?: string;
  fillOpacity?: number | string;
  fillRule?: 'nonzero' | 'evenodd' | 'inherit';
  stroke?: string;
  strokeDasharray?: string | number;
  strokeDashoffset?: string | number;
  strokeLinecap?: 'butt' | 'round' | 'square' | 'inherit';
  strokeLinejoin?: 'miter' | 'round' | 'bevel' | 'inherit';
  strokeMiterlimit?: number | string;
  strokeOpacity?: number | string;
  strokeWidth?: number | string;
}

export interface RenderedPolygon extends Omit<Polygon, 'coords'> {
  d: string;
}

export function extentPolygon(p: Polygon) {
  let bbox = infinitBBox;
  eachLatLngOfPolygon(p, ll => (bbox = bboxExtended(bbox, ll)));
  return bbox;
}

export function eachLatLngOfPolygon({ coords }: Polygon, callback: (ll: LngLat) => void) {
  const c = fixCoords(coords);
  for (let j = 0; j < c.length; j += 1) {
    for (let k = 0; k < c[j].length; k += 1) {
      for (let l = 0; l < c[j][k].length - 1; l += 1) {
        callback(c[j][k][l]);
      }
    }
  }
}

/**
 * Render Polygon to SVG
 */
export function processPolygon(map: StaticMapCtx, p: Polygon): RenderedPolygon {
  const shapeArrays = fixCoords(p.coords)
    .map(poly => poly.map(lr => lr.map(ll => [xToPx(map, lonToX(ll[0], map.zoom)), yToPx(map, latToY(ll[1], map.zoom))])))
    .flat();

  const pathArrays = shapeArrays.map(points => {
    const startPoint = points.shift()!;

    const pathParts = [`M ${startPoint[0]} ${startPoint[1]}`, ...points.map(p => `L ${p[0]} ${p[1]}`), 'Z'];

    return pathParts.join(' ');
  });

  const out = Object.assign({ d: pathArrays.join(' ') }, p);
  delete (out as any).coords;
  return out;
}

const fixCoords = (coords: CoordsPolygon | CoordsPolygon[]) =>
  !Array.isArray(coords[0][0][0]) ? [coords as CoordsPolygon] : (coords as CoordsPolygon[]);
