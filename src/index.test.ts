import { optimize } from 'svgo';
import mathjax from 'mathjax';
import texsvg from '.';
import { svgoOptimizeOptions } from './config';

jest.mock('svgo', () => ({
  optimize: jest.fn((input) => ({ data: `optimize(${input})` })),
}));

jest.mock('mathjax', () => ({
  init: jest.fn().mockResolvedValue({
    startup: {
      adaptor: {
        innerHTML: jest.fn((input) => `innerHTML(${input})`),
      },
    },
    tex2svg: jest.fn((input) => `tex2svg(${input})`),
  }),
}));

const mockedOptimize = jest.mocked(optimize);

beforeEach(() => {
  mockedOptimize.mockClear();
});

describe.each([
  undefined,
  null,
  0,
  1,
  {},
  [Array],
  Function,
  new Date(),
  new Set(),
  Symbol(),
  new Map(),
])('invalid argument: %p', (argument) => {
  it('is rejected', async () => {
    await expect(async () => {
      await texsvg(argument as string);
    }).rejects.toThrowError(new TypeError('First argument must be a string'));
  });
});

const tex1 = '\\frac{a}{b}';
const tex2 = '\\x^2';

describe('texsvg', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let MathJax: any;
  const mathjaxConfig = {
    loader: {
      load: ['input/tex', 'output/svg'],
    },
  };

  it('has a default export', () => {
    expect(texsvg).toBe(texsvg.default);
  });

  it('uses mathjax to convert TeX to SVG', async () => {
    expect(await texsvg(tex1)).toBe(`optimize(innerHTML(tex2svg(${tex1})))`);
    expect(mathjax.init).toHaveBeenCalledWith(mathjaxConfig);

    MathJax = await mathjax.init(mathjaxConfig);
    expect(MathJax.tex2svg).toHaveBeenCalledWith(tex1);
    expect(MathJax.startup.adaptor.innerHTML).toHaveBeenCalledWith(
      `tex2svg(${tex1})`,
    );
  });

  it('does not initialize mathjax more than once', async () => {
    // clear mathjax mocks
    mathjax.init.mockClear();
    MathJax.tex2svg.mockClear();
    MathJax.startup.adaptor.innerHTML.mockClear();

    // expect memoized function to be called
    expect(await texsvg(tex2)).toBe(`optimize(innerHTML(tex2svg(${tex2})))`);
    expect(mathjax.init).not.toHaveBeenCalled();
    expect(MathJax.tex2svg).toHaveBeenCalledTimes(1);
    expect(MathJax.startup.adaptor.innerHTML).toHaveBeenCalledTimes(1);
  });

  it('optimizes SVG with svgo', async () => {
    expect(await texsvg(tex2)).toBe(`optimize(innerHTML(tex2svg(${tex2})))`);
    expect(optimize).toHaveBeenCalledTimes(1);
    expect(optimize).toHaveBeenCalledWith(
      `innerHTML(tex2svg(${tex2}))`,
      svgoOptimizeOptions,
    );
  });
});

describe('optimize', () => {
  it('does not optimize SVG with svgo', async () => {
    expect(await texsvg(tex2, { optimize: false })).toBe(
      `innerHTML(tex2svg(${tex2}))`,
    );
    expect(optimize).not.toHaveBeenCalled();
  });
});
