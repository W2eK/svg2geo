const DOMParser = require('xmldom').DOMParser;
const cleanSvg = require('./src/svgo');
const getProjection = require('./src/projection');
const getBounds = require('./src/bounds');
const parseSvg = require('./src/parse');
const turf = require('@turf/helpers');
const rewind = require('@turf/rewind').default;
const truncator = require('@turf/truncate').default;

/**
 *
 * @param {String} input
 * @param {{bbox?: number[], step?: number, truncate?: boolean | number}} options
 * @returns {turf.FeatureCollection}
 */
function convertSvg(input, options = {}) {
  const {
    bbox = [-180, -85.051129, 180, 85.051129],
    step = 1,
    truncate = false
  } = options;
  function reProject(x) {
    if (Array.isArray(x)) {
      return x.map(reProject);
    } else {
      return projection(x);
    }
  }
  process.env.CURVE_SEGMENTATION_STEP = step + '';
  bbox[1] = Math.max(bbox[1], -85.051129);
  bbox[3] = Math.min(bbox[3], 85.051129);
  const svg = new DOMParser().parseFromString(input);
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
}

async function cleanUp(input, options = {}) {
  const { data } = await cleanSvg(input);
  return convertSvg(data, options);
}

/**
 *
 * @param {String} input
 * @param {{bbox?: number[], step?: number, truncate?: boolean | number, skipCleanup?: boolean} | undefined} options
 * @returns {turf.FeatureCollection | Promise<turf.FeatureCollection>}
 */

module.exports = function getSvgWrapper(input, options = {}) {
  if (options.skipCleanup) {
    return convertSvg(input, options);
  } else {
    return cleanUp(input, options);
  }
};
