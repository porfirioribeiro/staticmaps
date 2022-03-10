import { BBox, LngLat } from './types';

export function polyFromBBox(bbox: BBox): LngLat[][][] {
  return [
    [
      [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[1]],
        [bbox[2], bbox[3]],
        [bbox[0], bbox[3]],
        [bbox[0], bbox[1]],
      ],
    ],
  ];
}
