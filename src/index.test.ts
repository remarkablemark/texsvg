import mathjax from 'mathjax';
import texsvg from '.';

jest.mock('mathjax', () => ({
  init: jest.fn().mockResolvedValue({
    startup: {
      adaptor: {
        innerHTML: jest.fn((a) => a),
      },
    },
    tex2svg: jest.fn((a) => a),
  }),
}));

describe('texsvg', () => {
  const cases = [undefined, null, 0, 1, {}, [Array], Function, new Date()];

  it.each(cases)('rejects when argument is %s', async (value) => {
    try {
      await texsvg(value as string);
    } catch (error) {
      expect(error).toBe('First argument must be a string');
    }
  });
});

describe('mathjax', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let MathJax: any;
  const mathjaxConfig = {
    loader: {
      load: ['input/tex', 'output/svg'],
    },
  };

  beforeAll(async () => {
    MathJax = await mathjax.init(mathjaxConfig);
  });

  it('is initialized to convert TeX to SVG', async () => {
    const tex = '\\frac{a}{b}';
    expect(await texsvg(tex)).toBe(tex);

    expect(mathjax.init).toHaveBeenCalledWith(mathjaxConfig);
    expect(MathJax.tex2svg).toHaveBeenCalledWith(tex);
    expect(MathJax.startup.adaptor.innerHTML).toHaveBeenCalledWith(tex);
  });

  it('is not initialized more than once', async () => {
    // clear mathjax calls
    mathjax.init.mockClear();
    MathJax.tex2svg.mockClear();
    MathJax.startup.adaptor.innerHTML.mockClear();

    // expect memoized function to be used
    expect(await texsvg('a')).toBe('a');
    expect(mathjax.init).not.toHaveBeenCalled();
    expect(MathJax.tex2svg).toHaveBeenCalledTimes(1);
    expect(MathJax.startup.adaptor.innerHTML).toHaveBeenCalledTimes(1);
  });
});
