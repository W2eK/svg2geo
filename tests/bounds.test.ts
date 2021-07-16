import { DOMParser } from 'xmldom';
import getBounds from '../src/bounds';

describe('Getting correct bounding box', () => {
  describe('Getting bbox from rect', () => {
    test('RECT with width and height attributes', () => {
      const string = `<svg><rect id="bbox" width="100" height="100"/></svg>`;
      const svg = new DOMParser().parseFromString(string);
      const result = getBounds(svg);
      expect(result).toEqual({ x: 0, y: 0, width: 100, height: 100 });
    });
    test('Error: RECT with missed height attribute', () => {
      const string = `<svg><rect id="bbox" height="100"/></svg>`;
      const svg = new DOMParser().parseFromString(string);
      expect(() => getBounds(svg)).toThrow();
    });
    test('Error: CIRCLE with id="bbox"', () => {
      const string = `<svg><circle id="bbox" r="5"/></svg>`;
      const svg = new DOMParser().parseFromString(string);
      expect(() => getBounds(svg)).toThrow();
    });
  });
  /* ____________________________________ */
  describe('Getting bbox from svg', () => {
    test('SVG with width and height attributes', () => {
      const string = `<svg width="100" height="100"><circle x="50" y="50" r="10"/></svg>`;
      const svg = new DOMParser().parseFromString(string);
      const result = getBounds(svg);
      expect(result).toEqual({ x: 0, y: 0, width: 100, height: 100 });
    });
    test('SVG with viewBox attribute', () => {
      const string = `<svg viewBox="0 0 100 100"><circle x="50" y="50" r="10"/></svg>`;
      const svg = new DOMParser().parseFromString(string);
      const result = getBounds(svg);
      expect(result).toEqual({ x: 0, y: 0, width: 100, height: 100 });
    });
    test('Error: SVG without dimension attributes', () => {
      const string = `<svg><circle x="50" y="50" r="10"/></svg>`;
      const svg = new DOMParser().parseFromString(string);
      expect(() => getBounds(svg)).toThrow();
    });
  });
});
