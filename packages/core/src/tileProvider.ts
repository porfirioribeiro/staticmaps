import { TileProvider } from './types';

/**
 * Example Tile providers.
 * Providers can be adapted from leaflet https://leaflet-extras.github.io/leaflet-providers/preview/
 */

/** OpenStreetMap */
export const osmTileProvider: TileProvider = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  zoomRange: { min: 1, max: 19 },
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

/** OpenTopoMap */
export const otmTileProvider: TileProvider = {
  url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  attribution:
    'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  subdomains: ['a', 'b', 'c'],
  zoomRange: { min: 1, max: 17 },
};

export const esriWorldImageryTileProvider: TileProvider = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attribution:
    'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
};
