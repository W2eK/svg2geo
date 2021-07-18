import fs from 'fs';
import convertSvgToGeojson from '../src';

test('Main test', () => {
  const file = fs.readFileSync('./example.svg', 'utf-8');
  const geojson = convertSvgToGeojson(file);
   
  expect(geojson).toBeUndefined();
});
