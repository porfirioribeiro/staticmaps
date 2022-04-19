import { Polygon, RenderedPolygon } from './Polygon';
import { LineString, RenderedLineString } from './LineString';
import { OverlayImage, RenderedOverlayImage } from './OverlayImage';
import { Marker, RenderedMarker } from './Marker';

// https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.1
export type Position = [longitude: number, latitude: number, altitude?: number];

// https://datatracker.ietf.org/doc/html/rfc7946#section-5
export type BBox = [longitude: number, latitude: number, longitude: number, latitude: number];

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
  lineStrings?: LineString[];
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
  lineStrings: RenderedLineString[];
  overlayImages: RenderedOverlayImage[];
  markers: RenderedMarker[];
}
