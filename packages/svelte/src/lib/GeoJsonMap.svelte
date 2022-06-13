<script lang="ts">
	import type { Feature, FeatureCollection } from 'geojson';
	import type { GeoJsonRenderedOutput, Padding, TileProvider } from '@staticmaps/core';
	import { renderGeoJson } from '@staticmaps/core';

	export let geojson: Feature | FeatureCollection;
	export let width: number;
	export let height: number;
	export let padding: Padding = [0, 0];
	export let tileProviders: TileProvider[];

	let o: GeoJsonRenderedOutput;

	$: o = renderGeoJson({ geojson, width, height, padding, tileProviders });

	$: console.log(o);
</script>

<svg viewBox={o.viewBox} width={o.width} height={o.height}>
	{#each o.tiles as tile}
		<image {...tile} />
	{/each}

	{#each o.polygons as polygon}
		<path {...polygon} vector-effect="non-scaling-stroke" />
	{/each}

	{#each o.lineStrings as lineString}
		<path {...lineString} fill="transparent" vector-effect="non-scaling-stroke" />
	{/each}

	{#each o.markers as marker}
		<image {...marker} />
	{/each}
</svg>
