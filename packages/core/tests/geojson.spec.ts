import { Position } from 'geojson';
import { describe, expect, it } from 'vitest';

import { AllGeoJSON, eachCoord } from '../src/geojson';

describe('geojson', () => {
  it('eachCoord: Point', () => {
    expect(toCoordsArray({ type: 'Point', coordinates: [0, 0] })) //
      .toStrictEqual([[0, 0]]);
  });

  it('eachCoord: MultiPoint', () => {
    expect(
      toCoordsArray({
        type: 'MultiPoint',
        coordinates: [
          [0, 0],
          [1, 1],
        ],
      }),
    ).toStrictEqual([
      [0, 0],
      [1, 1],
    ]);
  });

  it('eachCoord: LineString', () => {
    expect(
      toCoordsArray({
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 1],
        ],
      }),
    ).toStrictEqual([
      [0, 0],
      [1, 1],
    ]);
  });

  it('eachCoord: Polygon', () => {
    expect(toCoordsArray({ type: 'Polygon', coordinates: polygon1 })) //
      .toStrictEqual([
        [0, 0],
        [1, 1],
        [0, 0],
      ]);
  });

  it('eachCoord: MultiPolygon', () => {
    expect(toCoordsArray({ type: 'MultiPolygon', coordinates: [polygon1, polygon2] })) //
      .toStrictEqual([
        // first polygon
        [0, 0],
        [1, 1],
        [0, 0],
        // second polygon
        [4, 4],
        [5, 5],
        [4, 4],
      ]);
  });

  it('big', () => {
    expect(
      toCoordsArray({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [-9.150066375732422, 38.725128367214204],
                [-9.142255783081055, 38.716590286734494],
                [-9.138092994689941, 38.70952467244517],
              ],
            },
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [-9.134531021118164, 38.70895537454283],
                [-9.13663387298584, 38.71364357514979],
                [-9.135603904724121, 38.71692513263708],
                [-9.13637638092041, 38.71705907055886],
                [-9.137277603149414, 38.71528437272555],
              ],
            },
          },
        ],
      }),
    ).toMatchInlineSnapshot(`
      [
        [
          -9.150066375732422,
          38.725128367214204,
        ],
        [
          -9.142255783081055,
          38.716590286734494,
        ],
        [
          -9.138092994689941,
          38.70952467244517,
        ],
        [
          -9.134531021118164,
          38.70895537454283,
        ],
        [
          -9.13663387298584,
          38.71364357514979,
        ],
        [
          -9.135603904724121,
          38.71692513263708,
        ],
        [
          -9.13637638092041,
          38.71705907055886,
        ],
        [
          -9.137277603149414,
          38.71528437272555,
        ],
      ]
    `);
  });
});

function toCoordsArray(geojson: AllGeoJSON) {
  const points: Position[] = [];
  eachCoord(geojson, p => points.push(p));
  return points;
}

const polygon1 = [
  [
    [0, 0],
    [1, 1],
    [0, 0],
  ],
  // interior ring
  [
    [2, 2],
    [3, 3],
    [2, 2],
  ],
];
const polygon2 = [
  [
    [4, 4],
    [5, 5],
    [4, 4],
  ],
  // interior ring
  [
    [6, 6],
    [7, 7],
    [6, 6],
  ],
];
