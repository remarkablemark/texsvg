/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs').promises;
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

describe('bin', () => {
  const { argv } = process;
  const processArgv = ['node', 'cjs/bin.js'];

  let consoleLog;

  beforeAll(() => {
    // mock implementation to override default behavior (prevent log)
    consoleLog = jest.spyOn(console, 'log').mockImplementation();
  });

  beforeEach(() => {
    consoleLog.mockClear();
  });

  afterAll(() => {
    process.argv = argv;
    consoleLog.mockRestore();
  });

  it('logs SVG to console when 1 argument is passed', (done) => {
    const tex = 'x';

    jest.isolateModules(async () => {
      process.argv = [...processArgv, tex];
      await require('../cjs/bin');
      const svg = consoleLog.mock.calls[0][0];
      expect(svg).toBe(await texsvg(tex));
      done();
    });
  });

  it('saves SVG to file when 2 arguments are passed ', async (done) => {
    // quadratic formula
    const tex = 'x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}';
    const file = 'test.svg';

    jest.isolateModules(async () => {
      process.argv = [...processArgv, tex, file];
      await require('../cjs/bin');
      expect(consoleLog).not.toBeCalled();
      const svg = await fs.readFile(file, 'utf8');
      await fs.unlink(file);
      expect(svg).toBe(await texsvg(tex));
      done();
    });
  });
});
