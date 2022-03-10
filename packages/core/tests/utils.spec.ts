import { describe, expect, it } from 'vitest';

import { bboxExtended, bboxJoin, getMapBBox, calculateZoom, getCenter } from '../src/utils';
import { LngLat, BBox } from '../src/types';
import { MultiPolygon } from '../src/MultiPolygon';
import { osmTileProvider } from '../src/tileProvider';

const bBox: BBox = [-8.9, 38.5, -8.9, 38.5];
const bBox2: BBox = [-10.8, 48.5, -10.8, 48.5];

const polygonCoords: MultiPolygon = {
  coords: [
    [
      [
        [-8.92, 38.56],
        [-8.93, 38.55],
        [-8.94, 38.58],
        [-8.92, 38.56],
      ],
    ],
  ],
};

describe('Utils tests', () => {
  it('should extend bbox', () => {
    const lngLat: LngLat = [-4.123456, 5.654321];

    expect(bboxExtended(bBox, lngLat)).toStrictEqual([-8.9, 5.654321, -4.123456, 38.5]);
  });
  it('should join bboxes', () => {
    expect(bboxJoin(bBox, bBox2)).toStrictEqual([-10.8, 38.5, -8.9, 48.5]);
  });
  it('should get mapBBox', () => {
    const zoom = 5;
    const width = 200;
    const height = 50;

    expect(getMapBBox({ multiPolygons: [polygonCoords], tileProvider: osmTileProvider, width, height }, zoom)).toStrictEqual([
      -8.94,
      38.55,
      -8.92,
      38.58,
    ]);
  });

  it('should calculate zoom', () => {
    const width = 250;
    const height = 50;
    const padding = [5, 5] as [number, number];

    expect(calculateZoom({ bbox: bBox, width, height, padding, tileProvider: osmTileProvider })).toStrictEqual([
      19,
      1,
      [-8.9, 38.5, -8.9, 38.5],
    ]);
  });
  it('should get center', () => {
    const zoom = 7;

    expect(getCenter(bBox, zoom)).toStrictEqual([60.83555555555555, 49.14688989969177]);
  });
});
