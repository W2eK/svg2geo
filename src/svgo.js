const SVGO = require('svgo');

const plugins = [
  { cleanupNumericValues: false },
  // { removeHiddenElems: false },
  { mergePaths: false },
  { cleanupIDs: false },
  { convertShapeToPath: false },
  { removeDimensions: true },
  { removeViewBox: false },
  { convertPathData: false }
];

module.exports = async function cleanSvg(svg) {
  const cleaner = new SVGO({ plugins });
  const result = await cleaner.optimize(svg);
  return result;
};
