import React from 'react';
import { wimTileProvider, StaticMap } from '../src';
import { rosaMP, rosaMarker1 } from './res/rosa';
import { paraguayOverlay, paraguayMP, paraguayMarkers } from './res/paraguay';
import { holedMP } from './res/holed';

const provider = wimTileProvider;

function App() {
  return (
    <div className="App">
      <StaticMap
        width={345}
        height={138}
        padding={[10, 10]}
        tileProvider={provider}
        bbox={paraguayOverlay.bbox}
        multiPolygons={[paraguayMP]}
        overlayImages={[paraguayOverlay]}
        markers={paraguayMarkers}
      />
      <div></div>
      <StaticMap width={250} height={250} padding={[5, 5]} tileProvider={provider} multiPolygons={[rosaMP]} markers={[rosaMarker1]} />
      <div></div>
      <StaticMap width={300} height={300} padding={[20, 20]} tileProvider={provider} multiPolygons={[holedMP]} />
    </div>
  );
}

export default App;
