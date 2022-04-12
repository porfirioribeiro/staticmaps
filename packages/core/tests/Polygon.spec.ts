import { assert, expect, test } from 'vitest';

import { extentPolygon, Polygon } from '../src/Polygon';

export const paraguayMP: Polygon = {
  fill: 'transparent',
  stroke: '#00C4B3CC',
  strokeWidth: 2,
  coords: [
    [
      [
        [-61.05320318376404, -21.399121942131075],
        [-61.05290474122633, -21.404873703400327],
        [-61.069199703793515, -21.40737439857918],
        [-61.06982643312247, -21.40053906374267],
        [-61.05320318376404, -21.399121942131075],
      ],
    ],
  ],
};

test('extentPolygon', () => {
  const p = extentPolygon(paraguayMP);

  expect(p).toStrictEqual([-61.06982643312247, -21.40737439857918, -61.05290474122633, -21.399121942131075]);
});
