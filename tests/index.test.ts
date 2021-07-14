const convert = require('../src/index').default;

test('Main test', () => {
  expect(convert()).toBeUndefined();
});
