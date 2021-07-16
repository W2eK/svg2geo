import assert from './utils/assert';

export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function getBounds(svg: Document): Bounds {
  /* a. Trying to find bbox rect element */
  const bbox = svg.getElementById('bbox');
  if (bbox) {
    assert(
      bbox.tagName === 'rect',
      `Element with id="bbox" must be RECT, not ${bbox.tagName}`
    );
    const x = +(bbox.getAttribute('x') || 0);
    const y = +(bbox.getAttribute('x') || 0);
    const width = +(bbox.getAttribute('width') || 0);
    const height = +(bbox.getAttribute('height') || 0);
    assert(!!width && !!height, 'width and height of RECT must be more then 0');
    return { x, y, width, height };
  }
  /* b. Calcing bbox from svg element dimensions */
  const root = svg.documentElement;
  if (root.getAttribute('width') && root.getAttribute('height')) {
    /* b1. If it has width and height properties */
    const width = +(root.getAttribute('width') as string);
    const height = +(root.getAttribute('height') as string);
    return { x: 0, y: 0, width, height };
  } else if (root.getAttribute('viewBox')) {
    /* b2. If it viewBox */
    const viewBox = root.getAttribute('viewBox') as string;
    const [x, y, width, height] = viewBox.split(' ').map(parseFloat);
    return { x, y, width, height };
  }
  assert(
    false,
    `SVG element doesn't contain width and height or viewBox property,
    nor RECT element with id="bbox" not found. Therefore unable to calc
    correct bounding box of graphics`
  );
}

export default getBounds;
