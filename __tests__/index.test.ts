import { optimize } from 'svgo';
import mathjax from 'mathjax';
import texsvg from '../src';
import { svgoOptimizeOptions } from '../src/config';

jest.mock('svgo', () => ({
  optimize: jest.fn((input) => ({ data: `optimize(${String(input)})` })),
}));

jest.mock('mathjax', () => {
  const tex2svgMock = jest.fn((input) => `tex2svg(${String(input)})`);
  const innerHTMLMock = jest.fn((input) => `innerHTML(${String(input)})`);
  const initMock = jest.fn().mockResolvedValue({
    startup: {
      adaptor: {
        innerHTML: innerHTMLMock,
      },
    },
    tex2svg: tex2svgMock,
  });
  return {
    init: initMock,
    __mocks: { tex2svg: tex2svgMock, innerHTML: innerHTMLMock, init: initMock },
  };
});

const mockedOptimize = jest.mocked(optimize);
const mockedMathjax = jest.mocked(mathjax);
// Access the internal mocks from mathjax module

const mathjaxMocks = (
  mathjax as unknown as {
    __mocks: { tex2svg: jest.Mock; innerHTML: jest.Mock; init: jest.Mock };
  }
).__mocks;

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
    }).rejects.toThrow(new TypeError('First argument must be a string'));
  });
});

const tex1 = '\\frac{a}{b}';
const tex2 = '\\x^2';

describe('texsvg', () => {
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

    const MathJax = await mathjax.init(mathjaxConfig);
    expect(MathJax.tex2svg).toHaveBeenCalledWith(tex1);
    expect(MathJax.startup.adaptor.innerHTML).toHaveBeenCalledWith(
      `tex2svg(${tex1})`,
    );
  });

  it('does not initialize mathjax more than once', async () => {
    // First call to initialize mathjax
    await texsvg(tex1);

    // clear call counts to test memoization
    mockedMathjax.init.mockClear();
    mathjaxMocks.tex2svg.mockClear();
    mathjaxMocks.innerHTML.mockClear();

    // expect memoized function to be called (no new init call)
    const result2 = await texsvg(tex2);
    expect(result2).toBe(`optimize(innerHTML(tex2svg(${tex2})))`);
    expect(mockedMathjax.init).not.toHaveBeenCalled();
    expect(mathjaxMocks.tex2svg).toHaveBeenCalledTimes(1);
    expect(mathjaxMocks.innerHTML).toHaveBeenCalledTimes(1);
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
