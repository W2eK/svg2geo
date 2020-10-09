module.exports = function getBounds(svg) {
  const bbox = svg.getElementById('bbox');
  if (bbox) {
    const rect =
      bbox.tagName === 'g' ? bbox.getElementsByTagName('rect')[0] : bbox;
    if (rect) {
      return {
        x: +rect.getAttribute('x') || 0,
        y: +rect.getAttribute('y') || 0,
        width: +rect.getAttribute('width'),
        height: +rect.getAttribute('height')
      };
    }
  }
  const root = svg.documentElement;
  if (root.getAttribute('width')) {
    return {
      x: 0,
      y: 0,
      width: +root.getAttribute('width'),
      height: +root.getAttribute('height')
    };
  } else {
    const viewBox = root.getAttribute('viewBox');
    const [x, y, width, height] = viewBox.split(' ').map(parseFloat);
    return { x, y, width, height };
  }
};
