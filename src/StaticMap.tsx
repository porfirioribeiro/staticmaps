import React, { useReducer } from 'react';
import { StaticMapsState, StaticMapOptions } from './types';
import { createStaticMap } from './createStaticMap';

function reducer(state: StaticMapsState, _action: any): StaticMapsState {
  return state;
}

interface StaticMapProps extends StaticMapOptions {
  className?: string;
  style?: React.CSSProperties;
  onMouseMove?: React.MouseEventHandler<SVGSVGElement>;
  onMouseLeave?: React.MouseEventHandler<SVGSVGElement>;
}

export function StaticMap({ className, style, onMouseMove, onMouseLeave, ...props }: StaticMapProps) {
  const [ctx] = useReducer(reducer, props, createStaticMap);

  const { width, height, viewBox, tiles, multiPolygons, overlayImages, markers, tileProvider } = ctx;

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      className={className}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <title>{tileProvider.attribution}</title>
      {tiles.map((t, i) => (
        <image key={i} {...t} />
      ))}
      {overlayImages.map((oi, i) => (
        <image key={i} {...oi} height={Math.abs(oi.height)} />
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
