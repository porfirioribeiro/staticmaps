### Render static maps with React

This small package allows you to render static maps easly with react.

It uses svg to render the tiles and the vectors for the MultiPolygon. You can specify a bounding box or if you pass any shape, it will automatically find the bounds for the shapes you want to add.

![demo](demo.png)

## Instalation

> yarn add staticmaps-react

## Usage


```typescript
<StaticMap
  width={250}
  height={250}
  padding={[5, 5]}
  tileProvider={esriWorldImageryTileProvider}
  multiPolygons={[rosaMP]}
  markers={[rosaMarker1]}
/>
```

## Available shapes

- Base TileLayer using x,y,z
- Marker
- MultiPolygon
- OverlayImage

## Demo

See a simple demo [here](https://staticmaps-react.netlify.app/)

> yarn preview


## Todo

- [ ] The basics of this project are not react related, so i hope to extract that into a core package and create implementations for Svelte and Vuejs maybe.
- [ ] Fix and improve the unit tests