import { TileProvider } from './types';

export const osmTileProvider: TileProvider = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  size: 256,
  subdomains: [],
  reverseY: false,
  zoomRange: { min: 1, max: 17 },
};

export const gmapsTileProvider: TileProvider = {
  url: 'https://mt{s}.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}',
  size: 256,
  subdomains: ['0', '1', '2', '3'],
  zoomRange: { min: 1, max: 21 },
};
