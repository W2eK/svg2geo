import cleanSvg from '../src/svgo';

// prettier-ignore
const svg = 
`<!-- Generator: Adobe Illustrator 24.0.1, SVG Export Plug-In  -->
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="109.791634px" height="109.791634px" viewBox="0 0 109.791634 109.791634"
	 style="enable-background:new 0 0 109.791634 109.791634;" xml:space="preserve">
<style type="text/css">
	.st0{fill:none;}
	.st1{fill:#E71800;stroke:#FFFFFF;stroke-miterlimit:10;}
	.st2{fill:none;stroke:#E71800;stroke-miterlimit:10;}
</style>
<defs>
</defs>
<rect id="bbox" class="st0" width="109.79163412345678901234567890px" height="109.791634px"/>
<circle class="st1" cx="38.769154px" cy="27.366461" r="5.212659"/>
<path class="st2" d="M33.556492,89.918373c0,0-0.147236-6.539803,7.818989-8.796364
	c7.966228-2.256569,19.873264-0.896431,21.17643-5.497978s-1.401409-12.698692-4.886868-17.633198
	c-3.485462-4.934505,0.32579-14.579659,11.728481-12.339592"/>
</svg>
`;
let result: string;
beforeAll(() => {
  result = cleanSvg(svg);
  // console.log(result);
});

describe('Cleaning SVG', () => {
  test('Numeric values cleaned from px values', () => {
    expect(result).not.toMatch(/\d[A-z]{2}"/);
  });
  test('Elements has id attribute', () => {
    expect(result).toMatch(/id="\w+"/);
  });
});
