/* eslint-disable no-bitwise */
import { StaticMapCtx, RenderedImage } from './types';
import { xToPx, yToPx } from './geo';

export function processTiles(map: StaticMapCtx): RenderedImage[] {
  const { size, url, subdomains } = map.tileProvider;
  const xMin = Math.floor(map.center[0] - (0.5 * map.width) / size);
  const yMin = Math.floor(map.center[1] - (0.5 * map.height) / size);
  const xMax = Math.ceil(map.center[0] + (0.5 * map.width) / size);
  const yMax = Math.ceil(map.center[1] + (0.5 * map.height) / size);

  const result: RenderedImage[] = [];

  for (let x = xMin; x < xMax; x += 1) {
    for (let y = yMin; y < yMax; y += 1) {
      // # x and y may have crossed the date line
      const maxTile = 2 ** map.zoom;
      const tileX = (x + maxTile) % maxTile;
      let tileY = (y + maxTile) % maxTile;
      if (map.tileProvider.reverseY) tileY = (1 << map.zoom) - tileY - 1;

      let tileUrl = url.replace('{z}', `${map.zoom}`).replace('{x}', `${tileX}`).replace('{y}', `${tileY}`);

      if (subdomains && subdomains.length > 0) {
        // replace subdomain with random domain from subdomains array
        tileUrl = tileUrl.replace('{s}', subdomains[(tileX + tileY) % subdomains.length]);
      }

      result.push({
        href: tileUrl,
        x: xToPx(map, x),
        y: yToPx(map, y),
        width: size /* + 0.5 */,
        height: size /* + 0.5 */,
      });
    }
  }

  return result;
}
