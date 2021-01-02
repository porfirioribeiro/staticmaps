import React, { useReducer } from 'react';
import { StaticMapsState, StaticMapOptions, createStaticMap } from '@staticmaps/core';

function reducer(state: StaticMapsState, _action: any): StaticMapsState {
  return state;
}

interface StaticMapProps extends StaticMapOptions {
  className?: string;
  style?: React.CSSProperties;
}

export function StaticMap({ className, style, ...props }: StaticMapProps) {
  const [ctx] = useReducer(reducer, props, createStaticMap);

  const { width, height, viewBox, tiles, multiPolygons, overlayImages, markers } = ctx;

  return (
    <svg width={width} height={height} viewBox={viewBox} className={className} style={style}>
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
