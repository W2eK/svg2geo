import { optimize, extendDefaultPlugins, Plugin } from 'svgo';

const plugins: Plugin[] = [
  {
    name: 'cleanupNumericValues',
    params: { floatPrecision: 100 }
  },
  { name: 'mergePaths', active: false },
  { name: 'cleanupIDs', active: false },
  { name: 'convertShapeToPath', active: false },
  { name: 'removeDimensions', active: true },
  { name: 'removeViewBox', active: false },
  { name: 'convertPathData', active: false },
  { name: 'inlineStyles', active: false }
];

function cleanSvg(svg: string) {
  const { data } = optimize(svg, { plugins: extendDefaultPlugins(plugins) });
  return data;
}

export default cleanSvg;
