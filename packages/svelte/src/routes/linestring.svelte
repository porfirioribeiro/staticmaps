<script lang="ts">
	import StaticMap from '$lib/StaticMap.svelte';
	import { esriWorldImageryTileProvider } from '@staticmaps/core';
</script>

<h1 class="py-8">PolyLines</h1>

<h3 class="py-16 mt-24">PolyLine</h3>

<StaticMap
	options={{
		width: 500,
		height: 500,
		padding: [10, 10],
		lineStrings: [
			{
				stroke: 'red',
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

<h3 class="py-16 mt-24">Multi PolyLine</h3>

<StaticMap
	options={{
		width: 500,
		height: 500,
		padding: [10, 10],
		tileProvider: esriWorldImageryTileProvider,
		lineStrings: [
			{
				stroke: 'blue',
				strokeWidth: 4,
				coords: [
					[
						[-9.150066375732422, 38.725128367214204],
						[-9.142255783081055, 38.716590286734494],
						[-9.138092994689941, 38.70952467244517]
					],
					[
						[-9.134531021118164, 38.70895537454283],
						[-9.13663387298584, 38.71364357514979],
						[-9.135603904724121, 38.71692513263708],
						[-9.13637638092041, 38.71705907055886],
						[-9.137277603149414, 38.71528437272555]
					]
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
