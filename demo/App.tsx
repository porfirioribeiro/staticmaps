import React from "react";
import { StaticMap, TileProvider } from "../src";
import { rosaMP, rosaMarker1 } from "./res/rosa";
import { paraguayOverlay, paraguayMP, paraguayMarkers } from "./res/paraguay";
import { holedMP } from "./res/holed";

const gmaps: TileProvider = {
  url: "http://mt{s}.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}",
  size: 256,
  subdomains: ["0", "1", "2", "3"],
  zoomRange: { min: 1, max: 21 },
};

function App() {
  return (
    <div className="App">
      <StaticMap
        width={345}
        height={138}
        padding={[10, 10]}
        tileProvider={gmaps}
        bbox={paraguayOverlay.bbox}
        multiPolygons={[paraguayMP]}
        overlayImages={[paraguayOverlay]}
        markers={paraguayMarkers}
      />
      <div></div>
      <StaticMap
        width={250}
        height={250}
        padding={[5, 5]}
        tileProvider={gmaps}
        multiPolygons={[rosaMP]}
        markers={[rosaMarker1]}
      />
      <div></div>
      <StaticMap
        width={300}
        height={300}
        padding={[20, 20]}
        tileProvider={gmaps}
        multiPolygons={[holedMP]}
      />
    </div>
  );
}

export default App;
