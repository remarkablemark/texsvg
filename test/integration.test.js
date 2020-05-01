// eslint-disable-next-line @typescript-eslint/no-var-requires
const texsvg = require('../cjs/index.js');

describe('texsvg', () => {
  it('can be required using CommonJS or imported using ES Modules', () => {
    expect(texsvg).toBe(texsvg.default);
  });

  it('renders TeX to SVG correctly', async () => {
    const tex = '\\frac{a}{b}';
    expect(await texsvg(tex)).toMatchSnapshot();
  });
});
