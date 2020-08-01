import React, { useReducer } from "react";
import { StaticMapsState, StaticMapProps } from "./types";
import { createStaticMap } from "./createStaticMap";

function reducer(state: StaticMapsState, action: any): StaticMapsState {
  return state;
}

export function StaticMap(props: StaticMapProps) {
  const [ctx] = useReducer(reducer, props, createStaticMap);

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
