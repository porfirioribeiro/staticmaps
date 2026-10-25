# @staticmaps/vue

Vue 3 bindings for [`@staticmaps/core`](../core), plus a demo.

## Installation

> pnpm add @staticmaps/vue

The package is ESM-only and requires Vue 3.5 or newer.

## Usage

```vue
<script setup lang="ts">
import { StaticMap, osmTileProvider } from '@staticmaps/vue';
</script>

<template>
  <StaticMap :options="{ width: 300, height: 300, tileProvider: osmTileProvider }" />
</template>
```

## Development

```bash
pnpm -C packages/vue start   # builds @staticmaps/core first, then starts the demo
pnpm -C packages/vue build   # vp pack + vue-tsc -> dist/ (ESM)
pnpm -C packages/vue test
```
