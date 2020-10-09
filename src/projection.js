const { toMercator, toWgs84 } = require('@turf/projection');

function getScale(from, to) {
  const domain = {
    difference: from[0] - from[1],
    min: from[0]
  };
  const range = {
    difference: to[0] - to[1],
    min: to[0]
  };
  return n =>
    ((n - domain.min) / domain.difference) * range.difference + range.min;
}

module.exports = function getProjection(bounds, bbox) {
  const [minX, minY, maxX, maxY] = bbox;
  const { x, y, width, height } = bounds;
  const getLongitude = getScale(
    [x, x + width],
    [toMercator([minX])[0], toMercator([maxX])[0]]
  );
  const getLatitude = getScale(
    [y + height, y],
    [toMercator([0, minY])[1], toMercator([0, maxY])[1]]
  );
  return ({x, y}) => toWgs84([getLongitude(x), getLatitude(y)]);
}
