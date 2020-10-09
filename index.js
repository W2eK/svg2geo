const DOMParser = require('xmldom').DOMParser;
const cleanSvg = require('./src/svgo');
const getProjection = require('./src/projection');
const getBounds = require('./src/bounds');
const parseSvg = require('./src/parse');
const turf = require('@turf/helpers');
const rewind = require('@turf/rewind').default;
const truncator = require('@turf/truncate').default;

module.exports = async function convertSvg(
  input,
  { bbox = [-180, -85.051129, 180, 85.051129], step = 0.5, truncate = false }
) {
  function reProject(x) {
    if (Array.isArray(x)) {
      return x.map(reProject);
    } else {
      return projection(x);
    }
  }
  process.env.CURVE_SEGMENTATION_STEP = step;
  bbox[1] = Math.max(bbox[1], -85.051129);
  bbox[3] = Math.min(bbox[3], 85.051129);
  const { data } = await cleanSvg(input);
  const svg = new DOMParser().parseFromString(data);
  const bounds = getBounds(svg);
  const projection = getProjection(bounds, bbox);
  const features = parseSvg(svg);
  const geojson = features.map(({ type, geometry, id }) => {
    const chain = [{ f: reProject }, { f: turf[type], args: { id } }];
    if (type === 'polygon') chain.push({ f: rewind });
    if (truncate !== false)
      chain.push({ f: truncator, args: { precision: truncate } });
    return chain.reduce((feature, { f, args }) => f(feature, args), geometry);
  });
  return turf.featureCollection(geojson);
};
