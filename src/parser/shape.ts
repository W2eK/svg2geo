import { toPath } from 'svg-points';
import { SVGTags } from './parser';

type Attributes = {
  [key: string]: number | string;
  type: string;
};

function parseShape(
  { points, ...attrs }: { [key: string]: string },
  type: SVGTags
) {
  if (type === 'polygon' || type === 'polyline') {
    // @ts-ignore
    return toPath({ type, points });
  } else {
    const attributes = {
      rect: ['height', 'width', 'x', 'y', 'rx', 'ry'],
      ellipse: ['cx', 'cy', 'rx', 'ry'],
      circle: ['cx', 'cy', 'r'],
      line: ['x1', 'y1', 'x2', 'y2'],
      path: ['d']
    };
    // attributes[type].map(key => key === '');
    const reducer = (obj: Attributes, attr: string) => {
      obj[attr] = +attrs[attr] || 0;
      return obj;
    };
    const shape = attributes[type].reduce(reducer, { type } as Attributes);
    // @ts-ignore
    return toPath(shape);
  }
}

export default parseShape;
