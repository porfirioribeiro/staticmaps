<script lang="ts" context="module">
	export const prerender = true;
	export const hidrate = false;
	export const router = false;
</script>

<script lang="ts">
	import StaticMap from '$lib/StaticMap.svelte';
	import { esriWorldImageryTileProvider } from '@staticmaps/core';
	import { paraguayMarkers, paraguayMP, paraguayOverlay } from './_res/paraguay';
</script>

<h1>Server Side Only</h1>

<StaticMap
	options={{
		width: 500,
		height: 500,
		padding: [10, 10],
		tileProvider: esriWorldImageryTileProvider,
		bbox: paraguayOverlay.bbox,
		multiPolygons: [paraguayMP],
		overlayImages: [paraguayOverlay],
		markers: paraguayMarkers
	}}
/>
