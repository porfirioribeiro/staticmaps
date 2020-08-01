import React, { useReducer } from "react";

import geoutils from "./geo";

import { getMapBBox, calculateZoom, getCenter, getBaselayer } from "./utils";
import { StaticMapProps, StaticMapCtx, Tile, TileProvider } from "./types";
import { multipolygonToPath, RenderedMultiPolygon } from "./MultiPolygon";
import { processOverlayImage, RenderedOverlayImage } from "./OverlayImage";

interface StaticMapsState extends StaticMapCtx {
  viewBox: string;
  tiles: Tile[];
  multiPolygons: RenderedMultiPolygon[];
  overlayImages: RenderedOverlayImage[];
}

const osmTileProvider: TileProvider = {
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  size: 256,
  subdomains: [],
  reverseY: false,
  zoomRange: { min: 1, max: 17 },
};

function create({
  width,
  height,
  padding = [0, 0],
  tileProvider = osmTileProvider,
  bbox: pbbox,
  multiPolygons,
  overlayImages,
}: StaticMapProps): StaticMapsState {
  const bbox = getMapBBox({ bbox: pbbox, multiPolygons, overlayImages });
  const [zoom, res] = calculateZoom({
    width,
    height,
    bbox,
    padding,
    tileProvider,
  });

  const w = width / res;
  const h = height / res;
  const viewBox = `${(width - w) / 2} ${(height - h) / 2} ${w} ${h}`;

  const center = getCenter(bbox, zoom);

  const map: StaticMapCtx = {
    width,
    height,
    padding,
    tileProvider,
    bbox,
    zoom,
    center,
  };

  const tiles = getBaselayer(map);

  return {
    ...map,
    viewBox,
    tiles,
    multiPolygons: (multiPolygons || []).map((mp) =>
      multipolygonToPath(map, mp)
    ),
    overlayImages: (overlayImages || []).map((oi) =>
      processOverlayImage(map, oi)
    ),
  };
}

function reducer(state: StaticMapsState, action: any): StaticMapsState {
  return state;
}

export function StaticMap(props: StaticMapProps) {
  const [ctx] = useReducer(reducer, props, create);

  const {
    width,
    height,
    viewBox,
    tiles,
    tileProvider,
    multiPolygons,
    overlayImages,
  } = ctx;

  console.log(overlayImages);

  return (
    <svg
      //
      width={width}
      height={height}
      viewBox={viewBox}
    >
      {tiles.map((t) => (
        <image
          key={t.url}
          href={t.url}
          x={t.bbox[0]}
          y={t.bbox[1]}
          width={tileProvider.size + 1}
        ></image>
      ))}
      {overlayImages.map((oi, i) => (
        <image key={i} {...oi} />
      ))}
      {multiPolygons.map((mp, i) => (
        <path key={i} {...mp} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
