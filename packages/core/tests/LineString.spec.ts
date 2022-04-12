import { expect, test } from 'vitest';

import { extentLineString } from '../src/LineString';

test('extentLineString with single LineString coords', () => {
  const p = extentLineString({
    coords: [
      [-61.05320318376404, -21.399121942131075],
      [-61.05290474122633, -21.404873703400327],
      [-61.069199703793515, -21.40737439857918],
      [-61.06982643312247, -21.40053906374267],
    ],
  });

  expect(p).toStrictEqual([-61.06982643312247, -21.40737439857918, -61.05290474122633, -21.399121942131075]);
});

test('extentLineString with MultiLineString coords', () => {
  const p = extentLineString({
    coords: [
      [
        [-61.05320318376404, -21.399121942131075],
        [-61.05290474122633, -21.404873703400327],
        [-61.069199703793515, -21.40737439857918],
        [-61.06982643312247, -21.40053906374267],
      ],
    ],
  });

  expect(p).toStrictEqual([-61.06982643312247, -21.40737439857918, -61.05290474122633, -21.399121942131075]);
});
