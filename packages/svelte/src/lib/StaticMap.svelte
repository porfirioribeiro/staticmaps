<script lang="ts">
	import {
		createStaticMap,
		dashedKeys,
		type StaticMapOptions
	} from '@staticmaps/core';

	let { options }: { options: StaticMapOptions } = $props();

	const state = $derived(createStaticMap(options));
</script>

<svg width={state.width} height={state.height} viewBox={state.viewBox}>
	{#each state.tiles as tile}
		<image {...tile} />
	{/each}
	{#each state.overlayImages as overlayImage}
		<image {...overlayImage} />
	{/each}
	{#each state.polygons as polygon}
		<path {...dashedKeys(polygon)} vector-effect="non-scaling-stroke" />
	{/each}
	{#each state.lineStrings as lineString}
		<path {...dashedKeys(lineString)} fill="transparent" vector-effect="non-scaling-stroke" />
	{/each}
	{#each state.markers as marker}
		<image {...marker} />
	{/each}

	{#if state.width >= 200}
		<foreignObject x="0" y="0" width={state.width} height={state.height}>
			<div>{@html state.attribution}</div>
		</foreignObject>
	{:else}
		<title>{@html state.attribution}</title>
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
