import { calculateZoom, defaultSize, getCenter } from './utils';
import { StaticMapOptions, StaticMapCtx, StaticMapsState } from './types';
import { processPolygon } from './Polygon';
import { processOverlayImage } from './OverlayImage';
import { processMarker } from './Marker';
import { processTiles } from './Tile';
import { osmTileProvider } from './tileProvider';
import { processLineString } from './LineString';

const defaultProps: Partial<StaticMapOptions> = {
  padding: [0, 0],
  tileProvider: osmTileProvider,
};

export function createStaticMap(cprops: StaticMapOptions): StaticMapsState {
  const props = Object.assign({}, defaultProps, cprops) as Required<StaticMapOptions>;
  const { width, height, padding, tileProvider, polygons, lineStrings, overlayImages, markers } = props;

  const [zoom, res, bbox] = calculateZoom(props);

  const w = width / res;
  const h = height / res;
  const viewBox = `${(width - w) / 2} ${(height - h) / 2} ${w} ${h}`;

  const center = getCenter(bbox, zoom);

  const map: StaticMapCtx = {
    width,
    height,
    padding,
    tileProvider,
    tileSize: tileProvider.size ?? defaultSize,
    bbox,
    zoom,
    res,
    center,
  };

  const tiles = processTiles(map);

  return Object.assign({}, map, {
    viewBox,
    attribution: tileProvider.attribution ?? '',
    tiles,
    polygons: (polygons || []).map(mp => processPolygon(map, mp)),
    lineStrings: (lineStrings || []).map(ls => processLineString(map, ls)),
    overlayImages: (overlayImages || []).map(oi => processOverlayImage(map, oi)),
    markers: (markers || []).map(m => processMarker(map, m)),
  });
}
