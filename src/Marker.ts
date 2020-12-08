import { xToPx, yToPx, lonToX, latToY } from './geo';
import { StaticMapCtx, LngLat, RenderedImage } from './types';

export interface Marker {
  // Coordinates of the marker ([Lng, Lat])
  coord: LngLat;
  // Marker image path or URL
  url: string;
  // Width of the marker image
  width: number;
  // Height of the marker image
  height: number;
  // (width/2) X offset of the marker image
  offsetX?: number;
  // (height) Y offset of the marker image
  offsetY?: number;
}

export type RenderedMarker = RenderedImage;

export function extentOfMarker({ width, height, offsetX = width / 2, offsetY = height }: Marker): [number, number] {
  return [offsetX, offsetY];
}

export function processMarker(
  map: StaticMapCtx,
  { width, height, offsetX = width / 2, offsetY = height, coord, url }: Marker,
): RenderedMarker {
  // markers should not be scaled up, so we apply the map.res calculation
  return {
    href: url,
    x: xToPx(map, lonToX(coord[0], map.zoom)) - offsetX / map.res,
    y: yToPx(map, latToY(coord[1], map.zoom)) - offsetY / map.res,
    width: width / map.res,
    height: height / map.res,
  };
}
