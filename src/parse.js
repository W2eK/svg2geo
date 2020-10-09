const flatSvg = require('./flat');
const parseCircle = require('./parsers/circle');
const parsePath = require('./parsers/path');
const parseShape = require('./parsers/shape');

const keep = [
  'circle',
  'path',
  'rect',
  'polygon',
  'polyline',
  'line',
  'ellipse'
];

module.exports = function parseSvg(svg) {
  const nodes = flatSvg(svg.documentElement);
  return nodes
    .filter(({ tag, id }) => keep.includes(tag) && id !== 'bbox')
    .map(({ tag, id, ...attrs }) => {
      let feature;
      if (tag === 'circle') {
        feature = parseCircle(attrs);
      } else if (tag === 'path') {
        feature = parsePath(attrs);
      } else {
        const d = parseShape(attrs, tag);
        feature = parsePath({ d });
      }
      return { ...feature, id };
    });
};
