import React, { useReducer } from 'react';
import { StaticMapsState, StaticMapOptions, createStaticMap } from '@staticmaps/core';

function reducer(state: StaticMapsState, _action: any): StaticMapsState {
  return state;
}

interface StaticMapProps extends StaticMapOptions {
  className?: string;
  style?: React.CSSProperties;
}

export function StaticMap(props: StaticMapProps) {
  const { className, style } = props;
  delete props.className;
  delete props.style;
  const [ctx] = useReducer(reducer, props, createStaticMap);

  const { width, height, viewBox, tiles, polygons, overlayImages, markers, tileProvider } = ctx;

  return (
    <svg width={width} height={height} viewBox={viewBox} className={className} style={style}>
      <title>{tileProvider.attribution}</title>
      {tiles.map((t, key) => React.createElement('image', Object.assign({ key }, t)))}
      {overlayImages.map((oi, key) => React.createElement('image', Object.assign({ key }, oi)))}
      {polygons.map((mp, key) => React.createElement('path', Object.assign({ key }, mp, { vectorEffect: 'non-scaling-stroke' })))}
      {markers.map((m, key) => React.createElement('image', Object.assign({ key }, m)))}
    </svg>
  );
}
