const absSvgPath = require('abs-svg-path');
const parseSvgPath = require('parse-svg-path');
const { svgPathProperties } = require('svg-path-properties');

function parseCurve(segment) {
  const { length } = segment;
  const n = Math.ceil(length / parseFloat(process.env.CURVE_SEGMENTATION_STEP));
  const step = length / n;
  const points = new Array(n - 1)
    .fill()
    .map((d, i) => (i + 1) * step)
    .map(distance => segment.getPointAtLength(distance));
  points.push(segment.end);
  return points;
}

function parseRings(segments, commands) {
  function filter({ x, y }) {
    return !isNaN(x) && !isNaN(y);
  }
  function reducer(points, [command], i) {
    if (!points.length) points.push(segments[i].start);
    if (command === 'Z') {
      rings.push(points.filter(filter));
      return [];
    } else if (parseRings.curves.includes(command)) {
      points.push(...parseCurve(segments[i]));
    } else {
      points.push(segments[i].end);
    }
    return points;
  }
  const rings = [];
  const points = commands
    .filter(([command]) => command !== 'M')
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

module.exports = function parsePath({ d }) {
  const commands = absSvgPath(parseSvgPath(d));
  const segments = new svgPathProperties(d).getParts();
  return parseRings(segments, commands);
};
