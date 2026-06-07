import { exec } from 'child_process';
import { promises } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

const { readFile, unlink } = promises;
const execPromise = promisify(exec);

// MathJax 4.x initialization takes longer
jest.setTimeout(60000);

describe('texsvg', () => {
  it('renders TeX to SVG correctly', async () => {
    const tex = '\\\\frac{a}{b}';
    const script = `
      const texsvg = require('./cjs/index.js');
      texsvg('${tex}').then(svg => {
        console.log(svg);
        process.exit(0);
      }).catch(err => {
        console.error(err);
        process.exit(1);
      });
    `;
    const { stdout } = await execPromise(`node -e "${script}"`, {
      cwd: resolve(__dirname, '..'),
    });
    expect(stdout).toContain('<svg');
    expect(stdout).toContain('</svg>');
  });
});

describe('bin', () => {
  const bin = resolve(__dirname, '../cjs/bin.js');

  it('logs SVG to console when 1 argument is passed', async () => {
    const tex = 'x=\\\\frac{-b\\\\pm\\\\sqrt{b^2-4ac}}{2a}';
    const { stdout } = await execPromise(`node ${bin} "${tex}"`);
    expect(stdout).toContain('<svg');
    expect(stdout).toContain('</svg>');
  });

  it('saves SVG to file when 2 arguments are passed', async () => {
    const tex = 'x';
    const file = resolve(__dirname, 'test.svg');
    await execPromise(`node ${bin} "${tex}" ${file}`);
    const svg = await readFile(file, 'utf8');
    await unlink(file);
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });
});
