<script lang="ts" context="module">
	export const prerender = true;
	export const hydrate = false;
	export const router = false;
</script>

<script lang="ts">
	import StaticMap from '$lib/StaticMap.svelte';
	import { esriWorldImageryTileProvider } from '@staticmaps/core';
	import { paraguayMarkers, paraguayMP, paraguayOverlay } from './_res/paraguay';
</script>

<h1>Server Side Only</h1>
<p>This page is server side rendered only, there is no javascript used here</p>

<StaticMap
	options={{
		width: 500,
		height: 500,
		padding: [10, 10],
		tileProvider: esriWorldImageryTileProvider,
		bbox: paraguayOverlay.bbox,
		polygons: [paraguayMP],
		overlayImages: [paraguayOverlay],
		markers: paraguayMarkers
	}}
/>
