import { Point } from 'svg-path-properties/dist/types/types';

export type Circle = {
  type: 'point';
  geometry: Point;
};

function parseCircle({ cx, cy }: { cx?: string; cy?: string }): Circle {
  return {
    geometry: {
      x: +(cx || 0),
      y: +(cy || 0)
    },
    type: 'point'
  };
}

export default parseCircle;
