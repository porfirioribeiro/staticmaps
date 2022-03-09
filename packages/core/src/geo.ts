import { StaticMapCtx } from './createStaticMap';

/**
 * transform tile number to pixel on image canvas
 */
export function xToPx(map: Pick<StaticMapCtx, 'center' | 'tileSize' | 'width'>, x: number) {
  return Math.round((x - map.center[0]) * map.tileSize + map.width / 2);
}

/**
 * transform tile number to pixel on image canvas
 */
export function yToPx(map: Pick<StaticMapCtx, 'center' | 'tileSize' | 'height'>, y: number) {
  return Math.round((y - map.center[1]) * map.tileSize + map.height / 2);
}

/**
 * Transform longitude to tile number
 */
export function lonToX(lon: number, zoom: number) {
  return ((lon + 180) / 360) * 2 ** zoom;
}

/**
 *  Transform latitude to tile number
 */
export function latToY(lat: number, zoom: number) {
  return ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * 2 ** zoom;
}

export function yToLat(y: number, zoom: number) {
  return (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / 2 ** zoom))) / Math.PI) * 180;
}

export function xToLon(x: number, zoom: number) {
  return (x / 2 ** zoom) * 360 - 180;
}

export function meterToPixel(meter: number, zoom: number, lat: number) {
  const latitudeRadians = lat * (Math.PI / 180);
  const meterProPixel = (156543.03392 * Math.cos(latitudeRadians)) / 2 ** zoom;
  return meter / meterProPixel;
}
