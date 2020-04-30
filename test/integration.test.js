// eslint-disable-next-line @typescript-eslint/no-var-requires
const texsvg = require('../cjs/index.js');

it('renders TeX to SVG correctly', async () => {
  const tex = '\\frac{a}{b}';
  expect(await texsvg(tex)).toMatchSnapshot();
});
