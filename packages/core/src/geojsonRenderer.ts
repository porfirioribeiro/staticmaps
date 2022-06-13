import {
  Feature,
  FeatureCollection,
  Geometry,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  Position,
} from 'geojson';
import { latToY, lonToX, xToPx, yToPx } from './geo';
import { eachFeature, getBBox } from './geojson';
import { SVGAttributes, SVGRenderOptions } from './svgtypes';
import { processTiles } from './Tile';
import { MapBaseSize, Padding, RenderedImage, TileProvider } from './types';
import { getCenter, getZoomScale, reduceZoomRange } from './utils';

export interface GeoJsonRenderOptions {
  geojson: Feature | FeatureCollection;

  width: number;
  height: number;
  padding: Padding;

  tileProviders: TileProvider[];
}

export interface GeoJsonRenderedOutput extends MapBaseSize {
  viewBox: string;
  tiles: RenderedImage[];
  polygons: SVGPath[];
  lineStrings: SVGPath[];
  markers: RenderedImage[];
}

export type SVGPath = SVGAttributes;

export function renderGeoJson({ geojson, width, height, padding, tileProviders }: GeoJsonRenderOptions): GeoJsonRenderedOutput {
  const zoomRange = reduceZoomRange(tileProviders);

  const bbox = getBBox(geojson);
  const [zoom] = getZoomScale(bbox, width, height, padding, zoomRange);
  const center = getCenter(bbox, zoom);
  // const w = width / res;
  // const h = height / res;
  // const viewBox = `${(width - w) / 2} ${(height - h) / 2} ${w} ${h}`;
  const viewBox = `0 0 ${width} ${height}`;

  const map: MapBaseSize = { width, height, center, zoom };

  const tiles = tileProviders.flatMap(tp => processTiles(map, tp));
  const polygons: SVGPath[] = [];
  const lineStrings: SVGPath[] = [];
  const markers: RenderedImage[] = [];

  eachFeature(geojson, feature => {
    renderFeature(feature, map, polygons, lineStrings, markers);
  });

  return Object.assign(map, { viewBox, tiles, polygons, lineStrings, markers });
}

function renderFeature(
  feature: Feature,
  map: MapBaseSize,
  polygons: SVGAttributes[],
  lineStrings: SVGAttributes[],
  markers: RenderedImage[],
) {
  const style = defaultFeatureRenderer(feature as any);

  switch (feature.geometry.type) {
    case 'Polygon':
    case 'MultiPolygon': {
      polygons.push(
        Object.assign(
          {
            d: polyToPath(map, feature.geometry.coordinates),
          },
          style,
        ),
      );
      break;
    }
    case 'LineString':
    case 'MultiLineString': {
      lineStrings.push(
        Object.assign(
          {
            d: lsToPath(map, feature.geometry.coordinates),
          },
          style,
        ),
      );
      break;
    }
    case 'Point':
    case 'MultiPoint':
      pointToPixels(map, feature.geometry.coordinates).forEach(p => {
        const width = 20;
        const height = 56;
        markers.push({
          x: p.x - width / 2,
          y: p.y - height / 2,
          width,
          height,
          href: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 56' width='${width}' height='${height}'%3E%3Cpath fill='%235b7897' stroke='%2323374d' stroke-width='1.5' d='M19.3 10.4a13 13 0 0 1-1.5 5.2 41.5 41.5 0 0 1-3.3 5.6 71.4 71.4 0 0 1-4.5 6l-.2-.3A73.2 73.2 0 0 1 5.5 21a42.3 42.3 0 0 1-3.3-5.5 13 13 0 0 1-1.5-5.2A9.5 9.5 0 0 1 10 .7a9.5 9.5 0 0 1 9.3 9.7Z'/%3E%3Ccircle cx='10' cy='10' r='4' fill='%23fff'/%3E%3C/svg%3E`,
        });
      });

      break;
    case 'GeometryCollection':
      feature.geometry.geometries.forEach(f => {
        renderFeature(
          {
            type: 'Feature',
            properties: feature.properties,
            geometry: f,
          },
          map,
          polygons,
          lineStrings,
          markers,
        );
      });
      break;
  }
}

function defaultFeatureRenderer(
  feature: Feature<Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon, SVGRenderOptions>,
): SVGRenderOptions {
  const type = feature.geometry.type;
  if (type === 'Point' || type == 'MultiPoint') return {};

  const {
    fill = '#555555',
    'fill-opacity': fo = 0.5,
    stroke = '#555555',
    'stroke-width': sw = 2,
    'stroke-opacity': so = 1,
  } = feature.properties;

  if (type === 'Polygon' || type === 'MultiPolygon') return { fill, 'fill-opacity': fo, stroke, 'stroke-width': sw, 'stroke-opacity': so };
  if (type === 'LineString' || type === 'MultiLineString') return { fill: 'transparent', stroke, 'stroke-width': sw, 'stroke-opacity': so };

  return feature.properties;
}
function polyToPath(map: MapBaseSize, coordinates: Position[][] | Position[][][]): string {
  return (
    // Ensure we get a MultiPolygon coordinate array
    (!Array.isArray(coordinates[0][0][0]) ? [coordinates as Position[][]] : (coordinates as Position[][][]))
      // convert the coordinates into pixels
      .flatMap(poly => poly.map(lr => lr.map(ll => [xToPx(map, lonToX(ll[0], map.zoom)), yToPx(map, latToY(ll[1], map.zoom))])))
      // convert the pixels into path commands
      .flatMap(([startPoint, ...points]) => [`M ${startPoint[0]} ${startPoint[1]}`, ...points.map(p => `L ${p[0]} ${p[1]}`), 'Z'])
      // Join all path commands to form the final path string
      .join(' ')
  );
}
function lsToPath(map: MapBaseSize, coordinates: Position[] | Position[][]): string {
  return (
    // Ensure we get a MultiLineString coordinate array
    (!Array.isArray(coordinates[0][0]) ? [coordinates as Position[]] : (coordinates as Position[][]))
      // convert the coordinates into pixels
      .map(lr => lr.map(ll => [xToPx(map, lonToX(ll[0], map.zoom)), yToPx(map, latToY(ll[1], map.zoom))]))
      // convert the pixels into path commands
      .flatMap(([startPoint, ...points]) => [`M ${startPoint[0]} ${startPoint[1]}`, ...points.map(p => `L ${p[0]} ${p[1]}`)])
      // Join all path commands to form the final path string
      .join(' ')
  );
}
function pointToPixels(map: MapBaseSize, coordinates: Position | Position[]): { x: number; y: number }[] {
  return (!Array.isArray(coordinates[0]) ? [coordinates as Position] : (coordinates as Position[])).map(p => ({
    x: xToPx(map, lonToX(p[0], map.zoom)),
    y: yToPx(map, latToY(p[1], map.zoom)),
  }));
}
