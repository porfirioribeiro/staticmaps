<script lang="ts">
	import {
		createStaticMap,
		dashedKeys,
		type StaticMapOptions,
		type StaticMapsState
	} from '@staticmaps/core';

	export let options: StaticMapOptions;

	let { width, height, viewBox, tiles, multiPolygons, overlayImages, markers, attribution } =
		{} as StaticMapsState;

	$: ({ width, height, viewBox, tiles, multiPolygons, overlayImages, markers, attribution } =
		createStaticMap(options));
</script>

<svg {width} {height} {viewBox}>
	{#each tiles as tile}
		<image {...tile} />
	{/each}
	{#each overlayImages as overlayImage}
		<image {...overlayImage} />
	{/each}
	{#each multiPolygons as multiPolygon}
		<path {...dashedKeys(multiPolygon)} vector-effect="non-scaling-stroke" />
	{/each}
	{#each markers as marker}
		<image {...marker} />
	{/each}

	{#if width >= 200}
		<foreignObject x="0" y="0" {width} {height}>
			<div>{@html attribution}</div>
		</foreignObject>
	{:else}
		<title>{@html attribution}</title>
	{/if}
</svg>

<style>
	svg {
		position: relative;
	}
	svg div {
		background: rgba(255, 255, 255, 0.7);
		position: absolute;
		right: 0;
		bottom: 0;
		padding: 0 5px;
		color: #333;
		font: 12px/1.5 'Helvetica Neue', Arial, Helvetica, sans-serif;
	}
</style>
