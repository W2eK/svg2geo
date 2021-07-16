import { DOMParser } from 'xmldom';
import cleanSvg from './svgo';

type Input = string | Document;
type Options = {
  bbox?: GeoJSON.BBox;
  step?: number;
  clean?: boolean;
  truncate?: boolean | number;
  output?: string;
  pretty?: boolean;
  attributes?: boolean;
};

function converSvgToGeojson(input: Input, options?: Options) {
  /* 1. Normalizing arguments */
  const {
    step = 1,
    truncate = false,
    clean = true,
    bbox = [-180, -85.051129, 180, 85.051129],
    attributes = false
  } = options || {};
  bbox[1] = Math.max(bbox[1], -85.051129);
  bbox[3] = Math.min(bbox[3], 85.051129);
  if (typeof input !== 'string') input = input.toString();
  if (clean) input = cleanSvg(input);
  const svg = new DOMParser().parseFromString(input);
}

export default converSvgToGeojson;
