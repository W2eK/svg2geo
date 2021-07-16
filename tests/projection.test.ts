import getProjection from '../src/projection';

describe('Projecting pixel values to coordinates', () => {
  test('Null Island position', () => {
    const bbox: GeoJSON.BBox = [-180, -85.051129, 180, 85.051129];
    const bounds = { x: 0, y: 0, width: 100, height: 100 };
    const projection = getProjection(bounds, bbox);
    expect(projection({x: 50, y: 50})).toEqual([0, 0])
  });
});
