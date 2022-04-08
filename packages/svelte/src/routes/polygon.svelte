<script lang="ts">
	import StaticMap from '$lib/StaticMap.svelte';
	import { osmTileProvider, type MultiPolygon } from '@staticmaps/core';

	export const multiPolygon: MultiPolygon = {
		fill: 'transparent',
		stroke: '#00C4B3CC',
		strokeWidth: 2,
		coords: [
			// polygon
			[
				// first linear ring is outer coordinates
				[
					[-80.19, 25.774],
					[-66.118, 18.466],
					[-64.757, 32.321],
					[-80.19, 25.774],
				],
				// other linear rings are holes
				// todo: support holed polygons
				// [
				// 	[-70.579, 28.745],
				// 	[-67.514, 29.57],
				// 	[-66.668, 27.339],
				// 	[-70.579, 28.745],
				// ]
			]
		]
	};
</script>

<h1>Polygons</h1>

<StaticMap
	options={{
		width: 500,
		height: 500,
		padding: [10, 10],
		tileProvider: osmTileProvider,
		multiPolygons: [multiPolygon]
	}}
/>
