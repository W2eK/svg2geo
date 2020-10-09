const { readFile, writeFile } = require('fs/promises');
const convertSvg = require('../index');

module.exports = async function cli(args) {
  const { file, output, bbox, pretty } = args;
  const svg = await readFile(file, 'utf8');
  const geojson = await convertSvg(svg, bbox);
  const result = JSON.stringify(...(pretty ? [geojson, null, 2] : [geojson]));
  writeFile(output, result);
};
