import { optimize } from 'svgo';
import type { OptimizedError } from 'svgo';
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

describe('texsvg', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let MathJax: any;
  const mathjaxConfig = {
    loader: {
      load: ['input/tex', 'output/svg'],
    },
  };
  const tex1 = '\\frac{a}{b}';
  const tex2 = '\\x^2';

  it('has a default export', () => {
    expect(texsvg).toBe(texsvg.default);
  });

  it('uses mathjax to convert TeX to SVG', async () => {
    expect(await texsvg(tex1)).toBe(`optimize(innerHTML(tex2svg(${tex1})))`);
    expect(mathjax.init).toBeCalledWith(mathjaxConfig);

    MathJax = await mathjax.init(mathjaxConfig);
    expect(MathJax.tex2svg).toBeCalledWith(tex1);
    expect(MathJax.startup.adaptor.innerHTML).toBeCalledWith(
      `tex2svg(${tex1})`
    );
  });

  it('does not initialize mathjax more than once', async () => {
    // clear mathjax mocks
    mathjax.init.mockClear();
    MathJax.tex2svg.mockClear();
    MathJax.startup.adaptor.innerHTML.mockClear();

    // expect memoized function to be called
    expect(await texsvg(tex2)).toBe(`optimize(innerHTML(tex2svg(${tex2})))`);
    expect(mathjax.init).not.toBeCalled();
    expect(MathJax.tex2svg).toBeCalledTimes(1);
    expect(MathJax.startup.adaptor.innerHTML).toBeCalledTimes(1);
  });

  it('optimizes SVG with svgo', async () => {
    expect(await texsvg(tex2)).toBe(`optimize(innerHTML(tex2svg(${tex2})))`);
    expect(optimize).toBeCalledTimes(1);
    expect(optimize).toBeCalledWith(
      `innerHTML(tex2svg(${tex2}))`,
      svgoOptimizeOptions
    );
  });

  it('throws error', async () => {
    const error = 'Error';
    mockedOptimize.mockReturnValueOnce({ error } as OptimizedError);
    await expect(texsvg(tex2)).rejects.toBe(error);
  });
});
