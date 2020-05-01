import SVGO from 'svgo';
import mathjax from 'mathjax';
import texsvg from '.';

jest.mock('svgo', () => {
  const optimize = jest.fn((input) =>
    Promise.resolve({ data: `optimize(${input})` })
  );
  const SVGOMock = jest.fn(() => ({ optimize }));
  // add `optimize` mock function as a property of `SVGO` mock
  // since a new function is created each time `SVGO` is instantiated
  (SVGOMock as jest.Mock & { optimize: jest.Mock }).optimize = optimize;
  return SVGOMock;
});

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

describe.each([undefined, null, 0, 1, {}, [Array], Function, new Date()])(
  'invalid argument: %p',
  (argument) => {
    it('is rejected', async () => {
      try {
        await texsvg(argument as string);
      } catch (error) {
        expect(error).toBe('First argument must be a string');
      }
    });
  }
);

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
    expect(mathjax.init).toHaveBeenCalledWith(mathjaxConfig);

    MathJax = await mathjax.init(mathjaxConfig);
    expect(MathJax.tex2svg).toHaveBeenCalledWith(tex1);
    expect(MathJax.startup.adaptor.innerHTML).toHaveBeenCalledWith(
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
    expect(mathjax.init).not.toHaveBeenCalled();
    expect(MathJax.tex2svg).toHaveBeenCalledTimes(1);
    expect(MathJax.startup.adaptor.innerHTML).toHaveBeenCalledTimes(1);
  });

  it('optimizes SVG with svgo', async () => {
    expect(SVGO).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { optimize } = SVGO as any;
    expect(optimize).toHaveBeenCalledTimes(2);
    expect(optimize).toHaveBeenCalledWith(`innerHTML(tex2svg(${tex1}))`);
    expect(optimize).toHaveBeenCalledWith(`innerHTML(tex2svg(${tex2}))`);
  });
});
