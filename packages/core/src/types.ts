import { Polygon, RenderedPolygon } from './Polygon';
import { OverlayImage, RenderedOverlayImage } from './OverlayImage';
import { Marker, RenderedMarker } from './Marker';

export type LngLat = [number, number];
/*                  lng   , lat   , lng   , lat */
export type BBox = [number, number, number, number];

export interface TileProvider {
  url: string;
  size?: number;
  subdomains?: string[];
  reverseY?: boolean;
  zoomRange?: { min: number; max: number };
  attribution?: string;
}

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
  polygons?: Polygon[];
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
  attribution: string;
  tiles: RenderedImage[];
  polygons: RenderedPolygon[];
  overlayImages: RenderedOverlayImage[];
  markers: RenderedMarker[];
}
