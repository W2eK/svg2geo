import fs from 'fs';
import convertSvgToGeojson from '../src';

test('Main test', () => {
  const file = fs.readFileSync('./example.svg', 'utf-8');
  const geojson = convertSvgToGeojson(file, {
    bbox: [37.622609, 55.748503, 37.67273, 55.781556]
  });
  expect(geojson.features.length).toBe(255);
});
