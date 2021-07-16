import { toMercator, toWgs84 } from '@turf/projection';
import { Bounds } from './bounds';

function getScale(from: [number, number], to: [number, number]) {
  const domain = {
    difference: from[0] - from[1],
    min: from[0]
  };
  const range = {
    difference: to[0] - to[1],
    min: to[0]
  };
  return (n: number) =>
    ((n - domain.min) / domain.difference) * range.difference + range.min;
}

function getProjection(bounds: Bounds, bbox: GeoJSON.BBox) {
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
  return ({ x, y }: { x: number; y: number }) =>
    toWgs84([getLongitude(x), getLatitude(y)]);
}

export default getProjection;
