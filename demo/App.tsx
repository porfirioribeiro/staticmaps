import React from 'react';
import { StaticMap } from '../src';
import { rosaMP, rosaMarker1 } from './res/rosa';
import { paraguayOverlay, paraguayMP, paraguayMarkers } from './res/paraguay';
import { holedMP } from './res/holed';
import { esriWorldImageryTileProvider, osmTileProvider } from '../src/tileProvider';

function App() {
  return (
    <div className="App">
      <h4>Marquers and overlay</h4>
      <StaticMap
        width={345}
        height={138}
        padding={[10, 10]}
        tileProvider={esriWorldImageryTileProvider}
        bbox={paraguayOverlay.bbox}
        multiPolygons={[paraguayMP]}
        overlayImages={[paraguayOverlay]}
        markers={paraguayMarkers}
      />
      <h4>MultiPolygon and Marker</h4>
      <StaticMap
        width={250}
        height={250}
        padding={[5, 5]}
        tileProvider={esriWorldImageryTileProvider}
        multiPolygons={[rosaMP]}
        markers={[rosaMarker1]}
      />
      <h4>Holed Polygon</h4>
      <StaticMap width={300} height={300} padding={[20, 20]} tileProvider={osmTileProvider} multiPolygons={[holedMP]} />
    </div>
  );
}

export default App;
