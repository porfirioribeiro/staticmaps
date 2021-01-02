export interface TileProvider {
  url: string;
  size: number;
  subdomains?: string[];
  reverseY?: boolean;
  zoomRange: { min: number; max: number };
}

export const osmTileProvider: TileProvider = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  size: 256,
  subdomains: [],
  reverseY: false,
  zoomRange: { min: 1, max: 19 },
};

export const otmTileProvider: TileProvider = {
  url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  size: 256,
  subdomains: ['a', 'b', 'c'],
  zoomRange: { min: 1, max: 17 },
};

export const wimTileProvider: TileProvider = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  size: 256,
  subdomains: [],
  zoomRange: { min: 1, max: 18 },
};
