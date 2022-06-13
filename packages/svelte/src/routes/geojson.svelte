<script lang="ts">
	import GeoJsonMap from '$lib/GeoJsonMap.svelte';
	import {
		esriWorldImageryTileProvider,
		cartoDB_VoyagerOnlyLabelsTileProvider,
		osmTileProvider
	} from '@staticmaps/core';
	const geojson: GeoJSON.FeatureCollection = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				properties: {
					stroke: '#ed333b',
					'stroke-width': 2,
					'stroke-opacity': 0.9,
					fill: '#ffa348',
					'fill-opacity': 0.4
				},
				geometry: {
					type: 'Polygon',
					coordinates: [
						[
							[-9.315719604492188, 39.33655454062548],
							[-9.3218994140625, 39.33323523479627],
							[-9.298038482666016, 39.30866747410233],
							[-9.290142059326172, 39.31557387864871],
							[-9.30868148803711, 39.33429742980725],
							[-9.315719604492188, 39.33655454062548]
						]
					]
				}
			},
			{
				type: 'Feature',
				properties: {
					stroke: '#555555',
					'stroke-width': 2,
					'stroke-opacity': 1,
					fill: '#555555',
					'fill-opacity': 0.5
				},
				geometry: {
					type: 'MultiPolygon',
					coordinates: [
						[
							[
								[-9.132900238037108, 39.33695284673498],
								[-9.15761947631836, 39.293524125006655],
								[-9.11865234375, 39.26761343386089],
								[-9.069557189941404, 39.327525660144794],
								[-9.132900238037108, 39.33695284673498]
							]
						],
						[
							[
								[-9.067840576171875, 39.324737093790155],
								[-9.11590576171875, 39.266816029847014],
								[-9.092903137207031, 39.2492708462234],
								[-9.023551940917969, 39.29897079446437],
								[-9.067840576171875, 39.324737093790155]
							]
						]
					]
				}
			},
			{
				type: 'Feature',
				properties: {
					stroke: 'red',
					'stroke-width': 2,
					'stroke-opacity': 1
				},
				geometry: {
					type: 'LineString',
					coordinates: [
						[-9.272117614746094, 39.32579941789298],
						[-9.25872802734375, 39.33190746834004],
						[-9.240531921386719, 39.33296968352212],
						[-9.233322143554686, 39.33721838288058],
						[-9.211006164550781, 39.33695284673498],
						[-9.200363159179688, 39.334031882567345]
					]
				}
			},
			{
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'MultiPoint',
					coordinates: [
						[-9.31640625, 39.364032338047984],
						[-9.292030334472656, 39.35022841846271]
					]
				}
			},
			{
				type: 'Feature',
				properties: {
					stroke: 'blue',
					'stroke-width': 2,
					'stroke-opacity': 1,
					fill: 'blue',
					'fill-opacity': 0.3
				},
				geometry: {
					type: 'Polygon',
					coordinates: [
						[
							[-9.292033016681671, 39.350230492573765],
							[-9.310226440429686, 39.15189515783362],
							[-9.016342163085938, 39.14550515180263],
							[-8.999862670898438, 39.348635482995995],
							[-9.292033016681671, 39.350230492573765]
						]
					]
				}
			},
			{
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'Point',
					coordinates: [-8.999884128570555, 39.34861888972712]
				}
			},
			{
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'Point',
					coordinates: [-9.016342163085938, 39.145488510404526]
				}
			},
			{
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'Point',
					coordinates: [-9.309883117675781, 39.15136267949029]
				}
			},
			{
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'GeometryCollection',
					geometries: [
						{
							type: 'Polygon',
							coordinates: [
								[
									[-9.199247360229492, 39.39004000257648],
									[-9.200105667114256, 39.387519275534686],
									[-9.200105667114256, 39.377833529911555],
									[-9.18405532836914, 39.373454601030474],
									[-9.177360534667969, 39.37717007349369],
									[-9.190921783447266, 39.392892294410515],
									[-9.199247360229492, 39.39004000257648]
								]
							]
						},
						{
							type: 'Point',
							coordinates: [-9.189977645874023, 39.3831409542565]
						}
					]
				}
			}
		]
	};

	const geojsonHoled: GeoJSON.Feature = {
		type: 'Feature',
		properties: {
			stroke: '#555555',
			'stroke-width': 2,
			'stroke-opacity': 1,
			fill: '#555555',
			'fill-opacity': 0.5
		},
		geometry: {
			type: 'Polygon',
			coordinates: [
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
	};
</script>

<GeoJsonMap
	width={1000}
	height={800}
	tileProviders={[esriWorldImageryTileProvider, cartoDB_VoyagerOnlyLabelsTileProvider]}
	{geojson}
/>
<GeoJsonMap width={500} height={500} tileProviders={[osmTileProvider]} geojson={geojsonHoled} />
