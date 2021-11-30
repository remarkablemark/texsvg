import { promises } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { resolve } from 'path';
import texsvg from '../cjs';

const { readFile, unlink } = promises;
const execPromise = promisify(exec);
const bin = resolve(__dirname, '../cjs/bin.js');

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

  // mock implementation to override default behavior (prevent log)
  const consoleLog = jest.spyOn(console, 'log').mockImplementation();

  beforeEach(() => {
    consoleLog.mockClear();
  });

  afterAll(() => {
    process.argv = argv;
    consoleLog.mockRestore();
  });

  it('logs SVG to console when 1 argument is passed', async () => {
    // quadratic formula
    const tex = 'x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}';
    process.argv = [...processArgv, tex];
    await require('../cjs/bin');
    expect(consoleLog).toBeCalledWith(await texsvg(tex));
  });

  it('saves SVG to file when 2 arguments are passed ', async () => {
    const tex = 'x';
    const file = 'test.svg';

    await execPromise(`node ${bin} ${tex} ${file}`);
    const svg = await readFile(file, 'utf8');
    await unlink(file);
    expect(svg).toBe(await texsvg(tex));
  });
});
