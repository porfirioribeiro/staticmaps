import { TileProvider } from './types';

/**
 * Example Tile providers.
 * Providers can be adapted from leaflet https://leaflet-extras.github.io/leaflet-providers/preview/
 */

export const osmTileProvider: TileProvider = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  zoomRange: { min: 1, max: 19 },
  attribution: '© OpenStreetMap contributors',
};

export const esriWorldImageryTileProvider: TileProvider = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attribution:
    'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
};
