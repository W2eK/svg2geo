import { parseSVG, makeAbsolute, Command } from 'svg-path-parser';
import { svgPathProperties } from 'svg-path-properties';
import { PartProperties, Point } from 'svg-path-properties/dist/types/types';
import assert from '../utils/assert';

export type Polygon = {
  type: 'polygon';
  geometry: Point[][];
};

export type LineString = {
  type: 'lineString';
  geometry: Point[];
};

function parseCurve(segment: PartProperties) {
  const { length } = segment;
  const n = Math.ceil(length / 1);
  const step = length / n;
  const points = new Array(n - 1)
    .fill(null)
    .map((d, i) => (i + 1) * step)
    .map(distance => segment.getPointAtLength(distance));
  points.push(segment.end);
  return points;
}

function parseRings(
  segments: PartProperties[],
  commands: Command[]
): Polygon | LineString {
  function filter({ x, y }: Point) {
    return !isNaN(x) && !isNaN(y);
  }
  function reducer(points: Point[], { code }: Command, i: number) {
    if (!points.length) points.push(segments[i].start);
    if (code === 'Z') {
      rings.push(points.filter(filter));
      return [];
    } else if (parseRings.curves.includes(code)) {
      points.push(...parseCurve(segments[i]));
    } else {
      points.push(segments[i].end);
    }
    return points;
  }
  const rings: Point[][] = [];
  const points = commands
    .filter(({ code }) => code !== 'M')
    .reduce(reducer, []);
  if (rings.length) {
    rings.forEach(ring => {
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (first.x !== last.y && first.x !== last.y) {
        ring.push(first);
      }
    });
    return { geometry: rings, type: 'polygon' };
  } else {
    return {
      geometry: points.filter(filter),
      type: 'lineString'
    };
  }
}

parseRings.curves = ['C', 'S', 'Q', 'T', 'A'];

function parsePath({ d }: { d?: string }) {
  assert(d !== undefined, 'PATH must contain d-attribute');
  const commands = makeAbsolute(parseSVG(d));
  const segments: PartProperties[] = new svgPathProperties(d).getParts();
  return parseRings(segments, commands);
}

export default parsePath;
