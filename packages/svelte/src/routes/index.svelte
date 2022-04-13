<script lang="ts">
	import { StaticMap, osmTileProvider, otmTileProvider, esriWorldImageryTileProvider } from '$lib';
	import { paraguayMarkers, paraguayMP, paraguayOverlay } from './_res/paraguay';
	import { rosaMarker1, rosaMP } from './_res/rosa';
	import { holedMP } from './_res/holed';

	let count = 0;
	let width = 180;
</script>

<h1>Welcome to SvelteKit</h1>
<p>
	Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
	<button on:click={() => count++}>count: {count}</button>
	<button on:click={() => (width = width == 800 ? 180 : 800)}>width: {width}</button>
</p>

<div>
	<StaticMap
		options={{ width, height: width, polygons: [holedMP], tileProvider: otmTileProvider }}
	/>
</div>

<h4>Marquers and overlay</h4>
<StaticMap
	options={{
		width: 345,
		height: 138,
		padding: [10, 10],
		tileProvider: esriWorldImageryTileProvider,
		bbox: paraguayOverlay.bbox,
		polygons: [paraguayMP],
		overlayImages: [paraguayOverlay],
		markers: paraguayMarkers
	}}
/>
<h4>Polygon and Marker</h4>
<StaticMap
	options={{
		width: 250,
		height: 250,
		padding: [5, 5],
		tileProvider: esriWorldImageryTileProvider,
		polygons: [rosaMP],
		markers: [rosaMarker1]
	}}
/>
<h4>Holed Polygon</h4>
<StaticMap
	options={{
		width: 300,
		height: 300,
		padding: [20, 20],
		tileProvider: osmTileProvider,
		polygons: [holedMP]
	}}
/>
