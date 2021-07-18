#!/usr/bin/env node
import yargs from 'yargs';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import converSvgToGeojson, { Options } from './index';

// type CliOptions = Options & { pretty?: boolean; file: string; output?: string };

function run(args) {
  const { file, output, bbox, pretty = true, step, truncate } = args;
  const svg = readFileSync(file, 'utf8');
  const geojson = converSvgToGeojson(svg, { bbox, step, truncate });
  const result = JSON.stringify.apply(
    null,
    pretty ? [geojson, null, 2] : [geojson]
  );
  writeFileSync(output, result);
}

const args = yargs
  .usage('Usage: $0 <svgfile> [options]')
  .example(
    '$0 -f input.svg -o out.geojson -p -b -115.9 37.2 -115.7 37.3',
    'Convert svg to geojson'
  )
  .option('file', {
    alias: 'f',
    describe: 'SVG target file',
    normalize: true,
    demandOption: true,
    type: 'string'
  })
  .option('bbox', {
    alias: 'b',
    describe: 'BBox in minX minY maxX maxY order',
    default: [-180, -85.051129, 180, 85.051129],
    nargs: 4,
    type: 'array'
  })
  .option('output', {
    alias: 'o',
    describe: 'Output geojson file',
    normalize: true,
    default: 'output.geojson',
    type: 'string'
  })
  .option('step', {
    alias: 's',
    describe: 'Set interval in pixels between points in curves',
    type: 'number',
    default: 1
  })
  .option('truncate', {
    alias: 't',
    describe: 'Truncates the precision of the output geometry',
    type: 'number',
    default: false
  })
  .option('pretty', {
    alias: 'p',
    describe: 'Prettify output geojson',
    type: 'boolean',
    default: false
  })
  .alias('v', 'version')
  .alias('h', 'help')
  .check(argv => {
    if (!existsSync(argv.file)) {
      throw new Error('Input svg file is not a readable file');
    } else if (argv.bbox.some(isNaN)) {
      throw new Error('BBox must contains numbers only');
    }
    return true;
  }).argv;

run(args);
