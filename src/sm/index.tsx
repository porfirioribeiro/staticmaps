import React, { useReducer } from "react";

import { calculateZoom, getCenter } from "./utils";
import {
  StaticMapProps,
  StaticMapCtx,
  TileProvider,
  StaticMapsState,
} from "./types";
import { multipolygonToPath } from "./MultiPolygon";
import { processOverlayImage } from "./OverlayImage";
import { processMarker } from "./Marker";
import { processTiles } from "./Tile";

const osmTileProvider: TileProvider = {
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  size: 256,
  subdomains: [],
  reverseY: false,
  zoomRange: { min: 1, max: 17 },
};

const defaultProps: Partial<StaticMapProps> = {
  padding: [0, 0],
  tileProvider: osmTileProvider,
};

function create(cprops: StaticMapProps): StaticMapsState {
  const props = { ...defaultProps, ...cprops } as Required<StaticMapProps>;
  const {
    width,
    height,
    padding,
    tileProvider,
    multiPolygons,
    overlayImages,
    markers,
  } = props;

  const [zoom, res, bbox] = calculateZoom(props);

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
    res,
    center,
  };

  const tiles = processTiles(map);

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
    markers: (markers || []).map((m) => processMarker(map, m)),
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
    multiPolygons,
    overlayImages,
    markers,
  } = ctx;

  return (
    <svg width={width} height={height} viewBox={viewBox}>
      {tiles.map((t, i) => (
        <image key={i} {...t} />
      ))}
      {overlayImages.map((oi, i) => (
        <image key={i} {...oi} />
      ))}
      {multiPolygons.map((mp, i) => (
        <path key={i} {...mp} vectorEffect="non-scaling-stroke" />
      ))}
      {markers.map((m, i) => (
        <image key={i} {...m} />
      ))}
    </svg>
  );
}
