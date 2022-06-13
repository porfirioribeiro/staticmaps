import { Feature, FeatureCollection, Geometry, GeometryCollection, Position } from 'geojson';
import { BBox } from './types';

export type AllGeoJSON = Feature | FeatureCollection | Geometry | GeometryCollection;

export function getBBox(geojson: AllGeoJSON): BBox {
  if (geojson.bbox != null) {
    return geojson.bbox as BBox;
  }
  const bbox: BBox = [Infinity, Infinity, -Infinity, -Infinity];
  eachCoord(geojson, position => {
    if (bbox[0] > position[0]) bbox[0] = position[0];
    if (bbox[1] > position[1]) bbox[1] = position[1];
    if (bbox[2] < position[0]) bbox[2] = position[0];
    if (bbox[3] < position[1]) bbox[3] = position[1];
  });
  return bbox;
}

export function eachCoord(geojson: AllGeoJSON, cb: (position: Position) => void) {
  const type = geojson.type;
  if (type === 'FeatureCollection') geojson.features.forEach(f => eachCoord(f, cb));
  else if (type == 'Feature') eachCoord(geojson.geometry, cb);
  else if (type == 'Point') cb(geojson.coordinates);
  else if (type == 'MultiPoint' || type == 'LineString') geojson.coordinates.forEach(cb);
  else if (type === 'Polygon') geojson.coordinates[0].forEach(cb);
  else if (type == 'MultiPolygon') geojson.coordinates.forEach(co => co[0].forEach(cb));
  else if (type === 'MultiLineString') geojson.coordinates.forEach(co => co.forEach(cb));
  else if (type === 'GeometryCollection') geojson.geometries.forEach(f => eachCoord(f, cb));
}

export function eachFeature(geojson: AllGeoJSON, cb: (feature: Feature) => void) {
  const type = geojson.type;
  if (type === 'FeatureCollection') geojson.features.forEach(cb);
  else if (type == 'Feature') cb(geojson);
  else if (type == 'GeometryCollection') geojson.geometries.forEach(geometry => cb({ type: 'Feature', geometry, properties: {} }));
  else cb({ type: 'Feature', geometry: geojson, properties: {} });
}
