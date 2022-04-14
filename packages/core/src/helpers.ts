import { BBox, Position } from './types';

export function polyFromBBox(bbox: BBox): Position[][][] {
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

export const dashed = (camel: string) => camel.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
export const dashedKeys = (o: any) => Object.fromEntries(Object.entries(o).map(([k, v]) => [dashed(k), v]));
