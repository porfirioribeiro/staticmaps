<script lang="ts">
	import { osmTileProvider } from '@staticmaps/core';
	import StaticMap from '$lib/StaticMap.svelte';
</script>

<h1 class="py-8">Polygons</h1>

<h3 class="py-16 mt-24">Polygon with 2 holes</h3>

<StaticMap
	options={{
		width: 500,
		height: 500,
		padding: [10, 10],
		tileProvider: osmTileProvider,
		lineStrings: [
			{
				stroke: '#00C4B3CC',
				strokeWidth: 2,
				coords: [
					[-80.19, 25.77],
					[-66.11, 18.46],
					[-64.75, 32.32]
				]
			}
		]
	}}
/>

<p class="my-24">
	<a
		target="__blank"
		href="https://github.com/porfirioribeiro/staticmaps/blob/main/packages/svelte/src/routes/linestring.svelte"
		>See source on GitHub</a
	>
</p>
