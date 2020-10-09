const { svgPathProperties } = require('svg-path-properties');
const abs = require('abs-svg-path');
const parse = require('parse-svg-path');
const { toPath } = require('svg-points');

function parseCircle(node) {
  return {
    geometry: {
      x: +node.getAttribute('cx') || 0,
      y: +node.getAttribute('cy') || 0
    },
    type: 'point'
  };
}

function parseCurve(segment) {
  const { length } = segment;
  const n = Math.ceil(length / 3.5);
  const step = length / n;
  const points = new Array(n - 1)
    .fill()
    .map((d, i) => (i + 1) * step)
    .map(distance => segment.getPointAtLength(distance));
  points.push(segment.end);
  return points;
}

function parseRings(segments, commands) {
  function reducer(points, [command], i) {
    if (!points.length) points.push(segments[i].start);
    if (command === 'Z') {
      rings.push(points);
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
    return { geometry: points, type: 'lineString' };
  }
}

parseRings.curves = ['C', 'S', 'Q', 'T', 'A'];

function parsePath(d) {
  const commands = abs(parse(d));
  const segments = new svgPathProperties(d).getParts();
  return parseRings(segments, commands);
}

function parseShape(node, tag) {
  if (tag === 'polygon' || tag === 'polyline') {
    return toPath({
      type: tag,
      points: node.getAttribute('points')
    });
  }
  const attributes = {
    rect: ['height', 'width', 'x', 'y', 'rx', 'ry'],
    ellipse: ['cx', 'cy', 'rx', 'ry'],
    circle: ['cx', 'cy', 'r'],
    line: ['x1', 'y1', 'x2', 'y2']
  };
  const shape = attributes[tag].reduce(
    (obj, attr) => {
      obj[attr] = +node.getAttribute(attr) || 0;
      return obj;
    },
    { type: tag }
  );
  return toPath(shape);
}

parseShape.tags = ['rect', 'polygon', 'polyline', 'line', 'ellipse'];

module.exports = function parseSvg(node) {
  const result = [];
  Array.from(node.childNodes)
    .filter(child => child.getAttribute)
    .forEach(child => {
      if (child.childNodes.length) {
        result.push(...parseSvg(child));
      } else {
        const tag = child.tagName;
        const id = child.getAttribute('id') || undefined;
        if (tag === 'circle') {
          result.push({ ...parseCircle(child), id });
        } else if (tag === 'path') {
          result.push({ ...parsePath(child.getAttribute('d')), id });
        } else if (parseShape.tags.includes(tag)) {
          result.push({ ...parsePath(parseShape(child, tag)), id });
        }
      }
    });
  return result;
};
