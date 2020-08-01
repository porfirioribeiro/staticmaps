import { MultiPolygon, RenderedMultiPolygon } from "./MultiPolygon";
import { OverlayImage, RenderedOverlayImage } from "./OverlayImage";
import { Marker, RenderedMarker } from "./Marker";

export type LngLat = [number, number];
/*                  lng   , lat   , lng   , lat */
export type BBox = [number, number, number, number];

export interface TileProvider {
  url: string;
  size: number;
  subdomains?: string[];
  reverseY?: boolean;
  zoomRange: { min: number; max: number };
}

export interface RenderedImage {
  href: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StaticMapProps {
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
