<script lang="ts">
	import { createStaticMap, type StaticMapOptions, type StaticMapsState } from '@staticmaps/core';

	export let options: StaticMapOptions;

	let { width, height, viewBox, tiles, multiPolygons } = {} as StaticMapsState;

	$: {
		({ width, height, viewBox, tiles, multiPolygons } = createStaticMap(options));
		console.log('updates', width, height);
	}
</script>

<svg {width} {height} {viewBox}>
	{#each tiles as tile}
		<image {...tile} />
	{/each}
	{#each multiPolygons as multiPolygon}
		<path {...multiPolygon} vector-effect="non-scaling-stroke" />
	{/each}
</svg>
