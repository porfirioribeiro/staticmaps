import { LngLat, StaticMapCtx } from './types';
import { xToPx, yToPx, lonToX, latToY } from './geo';
import { infinitBBox, bboxExtended } from './utils';

type CoordsLinearRing = LngLat[];
type CoordsPolygon = [exterior: CoordsLinearRing, ...holes: CoordsLinearRing[]];
type CoordsMultiPolygon = CoordsPolygon[];

export interface MultiPolygon {
  coords: CoordsMultiPolygon;
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

export interface RenderedMultiPolygon extends Omit<MultiPolygon, 'coords'> {
  d: string;
}

export function extentMultiPolygon(p: MultiPolygon) {
  let bbox = infinitBBox;
  eachLatLngOfMultiPolygon(p, ll => (bbox = bboxExtended(bbox, ll)));
  return bbox;
}

export function eachLatLngOfMultiPolygon({ coords }: MultiPolygon, callback: (ll: LngLat) => void) {
  for (let j = 0; j < coords.length; j += 1) {
    for (let k = 0; k < coords[j].length; k += 1) {
      for (let l = 0; l < coords[j][k].length - 1; l += 1) {
        callback(coords[j][k][l]);
      }
    }
  }
}

/**
 * Render MultiPolygon to SVG
 */
export function processMultiPolygon(map: StaticMapCtx, mpp: MultiPolygon): RenderedMultiPolygon {
  const shapeArrays = mpp.coords
    .map(poly => poly.map(lr => lr.map(ll => [xToPx(map, lonToX(ll[0], map.zoom)), yToPx(map, latToY(ll[1], map.zoom))])))
    .flat();

  const pathArrays = shapeArrays.map(points => {
    const startPoint = points.shift()!;

    const pathParts = [`M ${startPoint[0]} ${startPoint[1]}`, ...points.map(p => `L ${p[0]} ${p[1]}`), 'Z'];

    return pathParts.join(' ');
  });

  const out = Object.assign({ d: pathArrays.join(' ') }, mpp);
  delete (out as any).coords;
  return out;
}
