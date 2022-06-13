import { describe, expect, it } from 'vitest';
import { osmTileProvider, otmTileProvider } from '../src/tileProvider';
import { renderGeoJson } from '../src/geojsonRenderer';

const geojson: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        stroke: '#ed333b',
        'stroke-width': 2,
        'stroke-opacity': 0.9,
        fill: '#ffa348',
        'fill-opacity': 0.4,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-9.315719604492188, 39.33655454062548],
            [-9.3218994140625, 39.33350078506185],
            [-9.298038482666016, 39.30866747410233],
            [-9.290142059326172, 39.31557387864871],
            [-9.30868148803711, 39.33429742980725],
            [-9.315719604492188, 39.33655454062548],
          ],
        ],
      },
    },
  ],
};

describe('geojson', () => {
  it('coordEach: Point', () => {
    expect(renderGeoJson({ geojson, width: 200, height: 200, padding: [0, 0], tileProviders: [osmTileProvider, otmTileProvider] })) //
      .toMatchInlineSnapshot(`
        {
          "center": [
            1942.1181640625,
            1560.6718954410337,
          ],
          "height": 200,
          "lineStrings": [],
          "markers": [],
          "polygons": [
            {
              "d": "M 72 47 L 54 59 L 123 152 L 146 126 L 92 56 L 72 47 Z",
              "fill": "#ffa348",
              "fill-opacity": 0.4,
              "stroke": "#ed333b",
              "stroke-opacity": 0.9,
              "stroke-width": 2,
            },
          ],
          "tiles": [
            {
              "height": 256,
              "href": "https://tile.openstreetmap.org/12/1941/1560.png",
              "width": 256,
              "x": -186,
              "y": -72,
            },
            {
              "height": 256,
              "href": "https://tile.openstreetmap.org/12/1941/1561.png",
              "width": 256,
              "x": -186,
              "y": 184,
            },
            {
              "height": 256,
              "href": "https://tile.openstreetmap.org/12/1942/1560.png",
              "width": 256,
              "x": 70,
              "y": -72,
            },
            {
              "height": 256,
              "href": "https://tile.openstreetmap.org/12/1942/1561.png",
              "width": 256,
              "x": 70,
              "y": 184,
            },
            {
              "height": 256,
              "href": "https://a.tile.opentopomap.org/12/1941/1560.png",
              "width": 256,
              "x": -186,
              "y": -72,
            },
            {
              "height": 256,
              "href": "https://b.tile.opentopomap.org/12/1941/1561.png",
              "width": 256,
              "x": -186,
              "y": 184,
            },
            {
              "height": 256,
              "href": "https://b.tile.opentopomap.org/12/1942/1560.png",
              "width": 256,
              "x": 70,
              "y": -72,
            },
            {
              "height": 256,
              "href": "https://c.tile.opentopomap.org/12/1942/1561.png",
              "width": 256,
              "x": 70,
              "y": 184,
            },
          ],
          "viewBox": "0 0 200 200",
          "width": 200,
          "zoom": 12,
        }
      `);
  });
});
