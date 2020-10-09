const { toPath } = require('svg-points');

module.exports = function parseShape({ points, ...attrs }, type) {
  if (type === 'polygon' || type === 'polyline') {
    return toPath({ type, points });
  } else {
    const attributes = {
      rect: ['height', 'width', 'x', 'y', 'rx', 'ry'],
      ellipse: ['cx', 'cy', 'rx', 'ry'],
      circle: ['cx', 'cy', 'r'],
      line: ['x1', 'y1', 'x2', 'y2']
    };
    const shape = attributes[type].reduce(
      (obj, attr) => {
        obj[attr] = +attrs[attr]|| 0;
        return obj;
      },
      { type }
    );
    return toPath(shape);
  }
};
