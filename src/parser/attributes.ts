/*
const shapes = ['circle','path','rect','polygon','polyline','line','ellipse'] as const;
type SVGShapeTagName = typeof shapes[number];
type SVGShape = SVGCircleElement|SVGPathElement|SVGRectElement|SVGPolygonElement|SVGPolylineElement|SVGLineElement|SVGEllipseElement;
//| SVGGElement;
type Attributes = {tag: SVGShapeTagName;} & SVGShape;
*/

type SVGElementTagName = keyof SVGElementTagNameMap;
export type Attributes = {
  tag: SVGElementTagName;
  [key: string]: string;
};

function getAttributes(node: Element) {
  function reducer(obj: Attributes, { name, value }: Attr) {
    obj[name] = value;
    return obj;
  }
  const result: Attributes[] = [];
  Array.from(node.childNodes)
    .filter((child): child is Element => 'getAttribute' in child)
    .forEach(child => {
      /* TODO: Add G elements with children */
      if (child.hasChildNodes()) {
        result.push(...getAttributes(child));
      } else {
        const attributes: Attributes = {
          tag: child.tagName as SVGElementTagName
        };
        result.push(Array.from(child.attributes).reduce(reducer, attributes));
      }
    });
  return result;
}

export default getAttributes;
