<script setup lang="ts">
import { StaticMapsState, StaticMapOptions, createStaticMap } from '@staticmaps/core';

const props = defineProps<{ options: StaticMapOptions }>();
const o = createStaticMap(props.options);
</script>

<template>
  <svg :width="o.width" :height="o.height" :viewBox="o.viewBox">
    <image v-for="tile in o.tiles" v-bind="tile"></image>
    <path v-for="multiPolygon in o.multiPolygons" v-bind="multiPolygon" vectorEffect="non-scaling-stroke"></path>
  </svg>
  <div>Hello</div>
</template>
