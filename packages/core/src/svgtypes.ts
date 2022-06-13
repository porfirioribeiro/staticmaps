export interface SVGRenderOptions {
  //Polygon fill : stroke
  fill?: string | undefined | null;
  'fill-opacity'?: number | string | undefined | null;
  'fill-rule'?: 'nonzero' | 'evenodd' | 'inherit' | undefined | null;

  //Polygon / PolyLine : stroke
  stroke?: string | undefined | null;
  'stroke-dasharray'?: string | number | undefined | null;
  'stroke-dashoffset'?: string | number | undefined | null;
  'stroke-linecap'?: 'butt' | 'round' | 'square' | 'inherit' | undefined | null;
  'stroke-linejoin'?: 'miter' | 'round' | 'bevel' | 'inherit' | undefined | null;
  'stroke-miterlimit'?: string | undefined | null;
  'stroke-opacity'?: number | string | undefined | null;
  'stroke-width'?: number | string | undefined | null;
  'vector-effect'?: number | string | undefined | null;
}

export interface SVGAttributes {
  // Attributes which also defined in HTMLAttributes
  className?: string | undefined | null;
  class?: string | undefined | null;
  color?: string | undefined | null;
  height?: number | string | undefined | null;
  id?: string | undefined | null;
  lang?: string | undefined | null;
  max?: number | string | undefined | null;
  media?: string | undefined | null;
  method?: string | undefined | null;
  min?: number | string | undefined | null;
  name?: string | undefined | null;
  style?: string | undefined | null;
  target?: string | undefined | null;
  type?: string | undefined | null;
  width?: number | string | undefined | null;

  // Other HTML properties supported by SVG elements in browsers
  role?: string | undefined | null;
  tabindex?: number | undefined | null;
  crossorigin?: 'anonymous' | 'use-credentials' | '' | undefined | null;

  // SVG Specific attributes
  'accent-height'?: number | string | undefined | null;
  accumulate?: 'none' | 'sum' | undefined | null;
  additive?: 'replace' | 'sum' | undefined | null;
  'alignment-baseline'?:
    | 'auto'
    | 'baseline'
    | 'before-edge'
    | 'text-before-edge'
    | 'middle'
    | 'central'
    | 'after-edge'
    | 'text-after-edge'
    | 'ideographic'
    | 'alphabetic'
    | 'hanging'
    | 'mathematical'
    | 'inherit'
    | undefined
    | null;
  allowReorder?: 'no' | 'yes' | undefined | null;
  alphabetic?: number | string | undefined | null;
  amplitude?: number | string | undefined | null;
  'arabic-form'?: 'initial' | 'medial' | 'terminal' | 'isolated' | undefined | null;
  ascent?: number | string | undefined | null;
  attributeName?: string | undefined | null;
  attributeType?: string | undefined | null;
  autoReverse?: number | string | undefined | null;
  azimuth?: number | string | undefined | null;
  baseFrequency?: number | string | undefined | null;
  'baseline-shift'?: number | string | undefined | null;
  baseProfile?: number | string | undefined | null;
  bbox?: number | string | undefined | null;
  begin?: number | string | undefined | null;
  bias?: number | string | undefined | null;
  by?: number | string | undefined | null;
  calcMode?: number | string | undefined | null;
  'cap-height'?: number | string | undefined | null;
  clip?: number | string | undefined | null;
  'clip-path'?: string | undefined | null;
  clipPathUnits?: number | string | undefined | null;
  'clip-rule'?: number | string | undefined | null;
  'color-interpolation'?: number | string | undefined | null;
  'color-interpolation-filters'?: 'auto' | 'sRGB' | 'linearRGB' | 'inherit' | undefined | null;
  'color-profile'?: number | string | undefined | null;
  'color-rendering'?: number | string | undefined | null;
  contentScriptType?: number | string | undefined | null;
  contentStyleType?: number | string | undefined | null;
  cursor?: number | string | undefined | null;
  cx?: number | string | undefined | null;
  cy?: number | string | undefined | null;
  d?: string | undefined | null;
  decelerate?: number | string | undefined | null;
  descent?: number | string | undefined | null;
  diffuseConstant?: number | string | undefined | null;
  direction?: number | string | undefined | null;
  display?: number | string | undefined | null;
  divisor?: number | string | undefined | null;
  'dominant-baseline'?: number | string | undefined | null;
  dur?: number | string | undefined | null;
  dx?: number | string | undefined | null;
  dy?: number | string | undefined | null;
  edgeMode?: number | string | undefined | null;
  elevation?: number | string | undefined | null;
  'enable-background'?: number | string | undefined | null;
  end?: number | string | undefined | null;
  exponent?: number | string | undefined | null;
  externalResourcesRequired?: number | string | undefined | null;
  fill?: string | undefined | null;
  'fill-opacity'?: number | string | undefined | null;
  'fill-rule'?: 'nonzero' | 'evenodd' | 'inherit' | undefined | null;
  filter?: string | undefined | null;
  filterRes?: number | string | undefined | null;
  filterUnits?: number | string | undefined | null;
  'flood-color'?: number | string | undefined | null;
  'flood-opacity'?: number | string | undefined | null;
  focusable?: number | string | undefined | null;
  'font-family'?: string | undefined | null;
  'font-size'?: number | string | undefined | null;
  'font-size-adjust'?: number | string | undefined | null;
  'font-stretch'?: number | string | undefined | null;
  'font-style'?: number | string | undefined | null;
  'font-variant'?: number | string | undefined | null;
  'font-weight'?: number | string | undefined | null;
  format?: number | string | undefined | null;
  from?: number | string | undefined | null;
  fx?: number | string | undefined | null;
  fy?: number | string | undefined | null;
  g1?: number | string | undefined | null;
  g2?: number | string | undefined | null;
  'glyph-name'?: number | string | undefined | null;
  'glyph-orientation-horizontal'?: number | string | undefined | null;
  'glyph-orientation-vertical'?: number | string | undefined | null;
  glyphRef?: number | string | undefined | null;
  gradientTransform?: string | undefined | null;
  gradientUnits?: string | undefined | null;
  hanging?: number | string | undefined | null;
  href?: string | undefined | null;
  'horiz-adv-x'?: number | string | undefined | null;
  'horiz-origin-x'?: number | string | undefined | null;
  ideographic?: number | string | undefined | null;
  'image-rendering'?: number | string | undefined | null;
  in2?: number | string | undefined | null;
  in?: string | undefined | null;
  intercept?: number | string | undefined | null;
  k1?: number | string | undefined | null;
  k2?: number | string | undefined | null;
  k3?: number | string | undefined | null;
  k4?: number | string | undefined | null;
  k?: number | string | undefined | null;
  kernelMatrix?: number | string | undefined | null;
  kernelUnitLength?: number | string | undefined | null;
  kerning?: number | string | undefined | null;
  keyPoints?: number | string | undefined | null;
  keySplines?: number | string | undefined | null;
  keyTimes?: number | string | undefined | null;
  lengthAdjust?: number | string | undefined | null;
  'letter-spacing'?: number | string | undefined | null;
  'lighting-color'?: number | string | undefined | null;
  limitingConeAngle?: number | string | undefined | null;
  local?: number | string | undefined | null;
  'marker-end'?: string | undefined | null;
  markerHeight?: number | string | undefined | null;
  'marker-mid'?: string | undefined | null;
  'marker-start'?: string | undefined | null;
  markerUnits?: number | string | undefined | null;
  markerWidth?: number | string | undefined | null;
  mask?: string | undefined | null;
  maskContentUnits?: number | string | undefined | null;
  maskUnits?: number | string | undefined | null;
  mathematical?: number | string | undefined | null;
  mode?: number | string | undefined | null;
  numOctaves?: number | string | undefined | null;
  offset?: number | string | undefined | null;
  opacity?: number | string | undefined | null;
  operator?: number | string | undefined | null;
  order?: number | string | undefined | null;
  orient?: number | string | undefined | null;
  orientation?: number | string | undefined | null;
  origin?: number | string | undefined | null;
  overflow?: number | string | undefined | null;
  'overline-position'?: number | string | undefined | null;
  'overline-thickness'?: number | string | undefined | null;
  'paint-order'?: number | string | undefined | null;
  'panose-1'?: number | string | undefined | null;
  path?: string | undefined | null;
  pathLength?: number | string | undefined | null;
  patternContentUnits?: string | undefined | null;
  patternTransform?: number | string | undefined | null;
  patternUnits?: string | undefined | null;
  'pointer-events'?: number | string | undefined | null;
  points?: string | undefined | null;
  pointsAtX?: number | string | undefined | null;
  pointsAtY?: number | string | undefined | null;
  pointsAtZ?: number | string | undefined | null;
  preserveAlpha?: number | string | undefined | null;
  preserveAspectRatio?: string | undefined | null;
  primitiveUnits?: number | string | undefined | null;
  r?: number | string | undefined | null;
  radius?: number | string | undefined | null;
  refX?: number | string | undefined | null;
  refY?: number | string | undefined | null;
  'rendering-intent'?: number | string | undefined | null;
  repeatCount?: number | string | undefined | null;
  repeatDur?: number | string | undefined | null;
  requiredExtensions?: number | string | undefined | null;
  requiredFeatures?: number | string | undefined | null;
  restart?: number | string | undefined | null;
  result?: string | undefined | null;
  rotate?: number | string | undefined | null;
  rx?: number | string | undefined | null;
  ry?: number | string | undefined | null;
  scale?: number | string | undefined | null;
  seed?: number | string | undefined | null;
  'shape-rendering'?: number | string | undefined | null;
  slope?: number | string | undefined | null;
  spacing?: number | string | undefined | null;
  specularConstant?: number | string | undefined | null;
  specularExponent?: number | string | undefined | null;
  speed?: number | string | undefined | null;
  spreadMethod?: string | undefined | null;
  startOffset?: number | string | undefined | null;
  stdDeviation?: number | string | undefined | null;
  stemh?: number | string | undefined | null;
  stemv?: number | string | undefined | null;
  stitchTiles?: number | string | undefined | null;
  'stop-color'?: string | undefined | null;
  'stop-opacity'?: number | string | undefined | null;
  'strikethrough-position'?: number | string | undefined | null;
  'strikethrough-thickness'?: number | string | undefined | null;
  string?: number | string | undefined | null;
  stroke?: string | undefined | null;
  'stroke-dasharray'?: string | number | undefined | null;
  'stroke-dashoffset'?: string | number | undefined | null;
  'stroke-linecap'?: 'butt' | 'round' | 'square' | 'inherit' | undefined | null;
  'stroke-linejoin'?: 'miter' | 'round' | 'bevel' | 'inherit' | undefined | null;
  'stroke-miterlimit'?: string | undefined | null;
  'stroke-opacity'?: number | string | undefined | null;
  'stroke-width'?: number | string | undefined | null;
  surfaceScale?: number | string | undefined | null;
  systemLanguage?: number | string | undefined | null;
  tableValues?: number | string | undefined | null;
  targetX?: number | string | undefined | null;
  targetY?: number | string | undefined | null;
  'text-anchor'?: string | undefined | null;
  'text-decoration'?: number | string | undefined | null;
  textLength?: number | string | undefined | null;
  'text-rendering'?: number | string | undefined | null;
  to?: number | string | undefined | null;
  transform?: string | undefined | null;
  u1?: number | string | undefined | null;
  u2?: number | string | undefined | null;
  'underline-position'?: number | string | undefined | null;
  'underline-thickness'?: number | string | undefined | null;
  unicode?: number | string | undefined | null;
  'unicode-bidi'?: number | string | undefined | null;
  'unicode-range'?: number | string | undefined | null;
  'units-per-em'?: number | string | undefined | null;
  'v-alphabetic'?: number | string | undefined | null;
  values?: string | undefined | null;
  'vector-effect'?: number | string | undefined | null;
  version?: string | undefined | null;
  'vert-adv-y'?: number | string | undefined | null;
  'vert-origin-x'?: number | string | undefined | null;
  'vert-origin-y'?: number | string | undefined | null;
  'v-hanging'?: number | string | undefined | null;
  'v-ideographic'?: number | string | undefined | null;
  viewBox?: string | undefined | null;
  viewTarget?: number | string | undefined | null;
  visibility?: number | string | undefined | null;
  'v-mathematical'?: number | string | undefined | null;
  widths?: number | string | undefined | null;
  'word-spacing'?: number | string | undefined | null;
  'writing-mode'?: number | string | undefined | null;
  x1?: number | string | undefined | null;
  x2?: number | string | undefined | null;
  x?: number | string | undefined | null;
  xChannelSelector?: string | undefined | null;
  'x-height'?: number | string | undefined | null;
  xlinkActuate?: string | undefined | null;
  xlinkArcrole?: string | undefined | null;
  xlinkHref?: string | undefined | null;
  xlinkRole?: string | undefined | null;
  xlinkShow?: string | undefined | null;
  xlinkTitle?: string | undefined | null;
  xlinkType?: string | undefined | null;
  xmlBase?: string | undefined | null;
  xmlLang?: string | undefined | null;
  xmlns?: string | undefined | null;
  xmlnsXlink?: string | undefined | null;
  xmlSpace?: string | undefined | null;
  y1?: number | string | undefined | null;
  y2?: number | string | undefined | null;
  y?: number | string | undefined | null;
  yChannelSelector?: string | undefined | null;
  z?: number | string | undefined | null;
  zoomAndPan?: string | undefined | null;
}