import { DOMParser } from 'xmldom';
import cleanSvg from './svgo';
import getBounds from './bounds';
import getProjection from './projection';
import parseSvg from './parser';
import getFeatures from './features';

type Input = string | Document;
export type Options = {
  bbox?: GeoJSON.BBox;
  step?: number;
  clean?: boolean;
  truncate?: boolean | number;
  output?: string;
  pretty?: boolean;
  attributes?: boolean;
  flatten?: boolean;
};

function converSvgToGeojson(input: Input, options?: Options) {
  /* 1. Normalizing arguments */
  const {
    clean = true,
    bbox = [-180, -85.051129, 180, 85.051129],
    truncate = false,
    /* TODO: */
    step = 1,
    attributes = false,
    flatten = false
  } = options || {};
  bbox[1] = Math.max(bbox[1], -85.051129);
  bbox[3] = Math.min(bbox[3], 85.051129);

  /* 2. Clean and parse SVG */
  if (typeof input !== 'string') input = input.toString();
  if (clean) input = cleanSvg(input);
  const svg = new DOMParser().parseFromString(input);

  /* 3. Getting bounds of geometry */
  const bounds = getBounds(svg);

  /* 4. use provided bbox and bounds from svg to make correct projection */
  const projection = getProjection(bounds, bbox);
  /* 5. .Extract suitable svg elements and return them as JSON */
  const shapes = parseSvg(svg);
  /* 6. Convert them to GeoJSON Feature Collection */
  const geojson = getFeatures(shapes, projection, truncate);
  return geojson;
}

export default converSvgToGeojson;
