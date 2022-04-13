### Render static maps with React

This small package allows you to render static maps easly with react.

It uses svg to render the tiles and the vectors for the Polygon. You can specify a bounding box or if you pass any shape, it will automatically find the bounds for the shapes you want to add.

![demo](demo.png)

## Instalation

> yarn add @staticmaps/react

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

See a simple demo [here](https://staticmaps-react.netlify.app/)

> pnpm start

