import {
  point,
  polygon,
  lineString,
  featureCollection,
  AllGeoJSON,
  Feature,
  Position
} from '@turf/helpers';
import rewind from '@turf/rewind';
import truncator from '@turf/truncate';
import { Shape } from './parser';
import { Projection } from './projection';
import { Point } from 'svg-path-properties/dist/types/types';
import callRecursive from './utils/recursive';

type Positions = Position | Position[] | Position[][];

type Reducer = {
  fn:
    | ((positions: Position[][]) => Feature)
    | ((positions: Position) => Feature)
    | ((positions: Position[]) => Feature)
    | ((points: Point) => Positions)
    | (<T extends AllGeoJSON>(feature: any) => T);
  args?: { [key: string]: any };
};
const turf = { point, lineString, polygon, featureCollection };
function getFeatures(
  shapes: Shape[],
  projection: Projection,
  truncate: boolean | number
) {
  /* FIXME: Fix types issues */
  /* TODO:  Write tests      */
  const project = callRecursive<Point, GeoJSON.Position>(projection);
  const features = shapes.map(({ type, geometry, id }) => {
    const reducers: Reducer[] = [
      { fn: project },
      { fn: turf[type], args: { id } }
    ];
    if (type === 'polygon') reducers.push({ fn: rewind });
    if (truncate !== false)
      reducers.push({ fn: truncator, args: { precision: truncate } });
    // @ts-ignore
    const result = reducers.reduce(
      // @ts-ignore
      (feature, { fn, args }) => fn(feature, args),
      geometry
    ) as Feature;
    return result;
  });
  return turf.featureCollection(features);
}

export default getFeatures;
