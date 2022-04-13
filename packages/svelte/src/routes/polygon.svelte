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
		polygons: [
			{
				fill: 'red',
				stroke: '#00C4B3CC',
				strokeWidth: 2,
				coords: [
					// exterior line ring
					[
						[-80.19, 25.77],
						[-66.11, 18.46],
						[-64.75, 32.32],
						[-80.19, 25.77]
					],
					// interior line rings (holes)
					[
						[-76.37, 25.79],
						[-71.19, 27.95],
						[-67.11, 26.15],
						[-67.41, 20.22],
						[-76.37, 25.79]
					],
					[
						[-70.57, 28.74],
						[-67.51, 29.57],
						[-66.66, 27.33],
						[-70.57, 28.74]
					]
				]
			}
		]
	}}
/>

<h3 class="py-16 mt-24">Multiple Polygons with and without hole</h3>

<StaticMap
	options={{
		width: 500,
		height: 500,
		padding: [10, 10],
		tileProvider: osmTileProvider,
		polygons: [
			{
				fill: 'blue',
				fillOpacity: 0.2,
				stroke: 'blue',
				strokeWidth: 2,
				coords: [
					// polygon
					[
						// exterior line ring
						[
							[40.0, 40.0],
							[20.0, 45.0],
							[45.0, 30.0],
							[40.0, 40.0]
						]
					],
					// polygon
					[
						// exterior line ring
						[
							[20.0, 35.0],
							[10.0, 30.0],
							[10.0, 10.0],
							[30.0, 5.0],
							[45.0, 20.0],
							[20.0, 35.0]
						],
						// interior line rings (holes)
						[
							[30.0, 20.0],
							[20.0, 15.0],
							[20.0, 25.0],
							[30.0, 20.0]
						]
					]
				]
			}
		]
	}}
/>

<p class="my-24">
	<a
		target="__blank"
		href="https://github.com/porfirioribeiro/staticmaps/blob/main/packages/svelte/src/routes/polygon.svelte"
		>See source on GitHub</a
	>
</p>
