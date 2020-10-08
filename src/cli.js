const { readFile, writeFile } = require('fs/promises');
const convertSvg = require('./lib');

module.exports = async function cli(args) {
  const { file, output, bbox, pretty } = args;
  console.log(file, output, bbox);
  const svg = await readFile(file, 'utf8');
  const geojson = convertSvg(svg, bbox);
  const result = JSON.stringify(...(pretty ? [geojson, null, 2] : [geojson]));
  writeFile(output, result);
};
