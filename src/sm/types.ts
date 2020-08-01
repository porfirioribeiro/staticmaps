import { MultiPolygon } from "./MultiPolygon";
import { BBox } from "./utils";
import { OverlayImage } from "./OverlayImage";

export interface TileProvider {
  url: string;
  size: number;
  subdomains?: string[];
  reverseY?: boolean;
  zoomRange: { min: number; max: number };
}

export interface StaticMapProps {
  width: number;
  height: number;
  padding?: [number, number];
  tileProvider?: TileProvider;
  bbox?: BBox;
  multiPolygons?: MultiPolygon[];
  overlayImages?: OverlayImage[];
}

export interface StaticMapCtx {
  width: number;
  height: number;
  padding: [number, number];
  tileProvider: TileProvider;
  bbox: BBox;
  zoom: number;
  center: [number, number];
}

export interface Tile {
  bbox: BBox;
  url: string;
}
