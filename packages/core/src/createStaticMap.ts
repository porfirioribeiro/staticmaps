import { calculateZoom, getCenter } from './utils';
import { MultiPolygon, processMultiPolygon, RenderedMultiPolygon } from './MultiPolygon';
import { OverlayImage, processOverlayImage, RenderedOverlayImage } from './OverlayImage';
import { Marker, processMarker, RenderedMarker } from './Marker';
import { processTiles } from './Tile';
import { osmTileProvider, TileProvider } from './tileProvider';

export type LngLat = [number, number];
/*                  lng   , lat   , lng   , lat */
export type BBox = [number, number, number, number];

export interface RenderedImage {
  href: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StaticMapOptions {
  width: number;
  height: number;
  padding?: [number, number];
  tileProvider?: TileProvider;
  bbox?: BBox;
  multiPolygons?: MultiPolygon[];
  overlayImages?: OverlayImage[];
  markers?: Marker[];
}

export interface StaticMapCtx {
  width: number;
  height: number;
  padding: [number, number];
  tileProvider: TileProvider;
  tileSize: number;
  bbox: BBox;
  zoom: number;
  res: number;
  center: [number, number];
}

export interface StaticMapsState extends StaticMapCtx {
  viewBox: string;
  tiles: RenderedImage[];
  multiPolygons: RenderedMultiPolygon[];
  overlayImages: RenderedOverlayImage[];
  markers: RenderedMarker[];
}

const defaultProps: Partial<StaticMapOptions> = {
  padding: [0, 0],
  tileProvider: osmTileProvider,
};

export function createStaticMap(cprops: StaticMapOptions): StaticMapsState {
  const props = Object.assign({}, defaultProps, cprops) as Required<StaticMapOptions>;
  const { width, height, padding, tileProvider, multiPolygons, overlayImages, markers } = props;

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
    tileSize: tileProvider.size,
    bbox,
    zoom,
    res,
    center,
  };

  const tiles = processTiles(map);

  return Object.assign({}, map, {
    viewBox,
    tiles,
    multiPolygons: (multiPolygons || []).map(mp => processMultiPolygon(map, mp)),
    overlayImages: (overlayImages || []).map(oi => processOverlayImage(map, oi)),
    markers: (markers || []).map(m => processMarker(map, m)),
  });
}
