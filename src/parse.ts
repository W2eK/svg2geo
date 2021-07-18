import getAttributes from './parsers/attributes';
import parseCircle, { Circle } from './parsers/circle';
import parsePath, { Polygon, LineString } from './parsers/path';
import parseShape from './parsers/shape';

const keep = [
  'circle',
  'path',
  'rect',
  'polygon',
  'polyline',
  'line',
  'ellipse'
] as const;

export type SVGTags = typeof keep[number];

export type Shape = { id?: string } & (Circle | Polygon | LineString);

function parseSvg(svg: Document): Shape[] {
  /* FIXME: Fix types   */
  /* TODO:  Write tests */
  const attributes = getAttributes(svg.documentElement);
  return attributes
    .filter(
      ({ tag, id }) =>
        (keep as ReadonlyArray<string>).includes(tag) && id !== 'bbox'
    )
    .map(({ tag, id, ...attrs }) => {
      let feature: Shape;
      const t = attrs.cx;
      if (tag === 'circle') {
        feature = parseCircle(attrs);
      } else if (tag === 'path') {
        feature = parsePath(attrs);
      } else {
        // @ts-ignore
        const d = parseShape(attrs, tag);
        feature = parsePath({ d });
      }
      return { ...feature, id };
    });
}

export default parseSvg;
