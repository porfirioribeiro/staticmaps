### Render static maps with React

This small package allows you to render static maps easly with react.

It uses svg to render the tiles and the vectors for the Polygon. You can specify a bounding box or if you pass any shape, it will automatically find the bounds for the shapes you want to add.

![demo](demo.png)

## Installation

> pnpm add @staticmaps/react

The package is ESM-only and requires React 18 or 19.

## Usage

```typescript
<StaticMap
  width={250}
  height={250}
  padding={[5, 5]}
  tileProvider={esriWorldImageryTileProvider}
  polygons={[rosaMP]}
  markers={[rosaMarker1]}
/>
```

## Available shapes

- Base TileLayer using x,y,z
- Marker
- Polygon
- OverlayImage

## Demo

See a simple demo [here](https://staticmaps-react.netlify.app/).

```bash
pnpm -C packages/react start   # builds @staticmaps/core first
```

## Development

```bash
pnpm -C packages/react start   # React 19 demo
pnpm -C packages/react build   # vp pack -> dist/index.js + index.d.ts (ESM)
pnpm -C packages/react test
```
