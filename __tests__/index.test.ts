import mathjax from 'mathjax';
import { optimize } from 'svgo';
import { texsvg } from '../src';
import { svgoOptimizeOptions } from '../src/config';

jest.mock('svgo', () => ({
  optimize: jest.fn((input) => ({ data: `optimize(${String(input)})` })),
}));

jest.mock('mathjax', () => {
  const tex2svgPromiseMock = jest.fn((input) =>
    Promise.resolve(`tex2svgPromise(${String(input)})`),
  );
  const firstChildMock = jest.fn((input) => `firstChild(${String(input)})`);
  const serializeXMLMock = jest.fn((input) => `serializeXML(${String(input)})`);
  const startupPromiseMock = Promise.resolve();
  const mockModule: Record<string, unknown> = {
    init: jest.fn().mockImplementation(() => {
      // Simulate MathJax 4.x modifying the module after init
      mockModule.startup = {
        adaptor: {
          firstChild: firstChildMock,
          serializeXML: serializeXMLMock,
        },
        promise: startupPromiseMock,
      };
      mockModule.tex2svgPromise = tex2svgPromiseMock;
      return Promise.resolve(mockModule);
    }),
    __mocks: {
      tex2svgPromise: tex2svgPromiseMock,
      firstChild: firstChildMock,
      serializeXML: serializeXMLMock,
      startupPromise: startupPromiseMock,
    },
  };
  return mockModule;
});

const mockedOptimize = jest.mocked(optimize);
const mockedMathjax = jest.mocked(mathjax);
// Access the internal mocks from mathjax module

const mathjaxMocks = (
  mathjax as unknown as {
    __mocks: {
      tex2svgPromise: jest.Mock;
      firstChild: jest.Mock;
      serializeXML: jest.Mock;
      init: jest.Mock;
      startupPromise: Promise<void>;
    };
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

  it('uses mathjax to convert TeX to SVG', async () => {
    expect(await texsvg(tex1)).toBe(
      `optimize(serializeXML(firstChild(tex2svgPromise(${tex1}))))`,
    );
    expect(mathjax.init).toHaveBeenCalledWith(mathjaxConfig);

    const MathJax = await mathjax.init(mathjaxConfig);
    expect(MathJax.tex2svgPromise).toHaveBeenCalledWith(tex1);
    expect(MathJax.startup.adaptor.firstChild).toHaveBeenCalledWith(
      `tex2svgPromise(${tex1})`,
    );
    expect(MathJax.startup.adaptor.serializeXML).toHaveBeenCalledWith(
      `firstChild(tex2svgPromise(${tex1}))`,
    );
  });

  it('does not initialize mathjax more than once', async () => {
    // First call to initialize mathjax
    await texsvg(tex1);

    // clear call counts to test memoization
    mockedMathjax.init.mockClear();
    mathjaxMocks.tex2svgPromise.mockClear();
    mathjaxMocks.firstChild.mockClear();
    mathjaxMocks.serializeXML.mockClear();

    // expect memoized function to be called (no new init call)
    const result2 = await texsvg(tex2);
    expect(result2).toBe(
      `optimize(serializeXML(firstChild(tex2svgPromise(${tex2}))))`,
    );
    expect(mockedMathjax.init).not.toHaveBeenCalled();
    expect(mathjaxMocks.tex2svgPromise).toHaveBeenCalledTimes(1);
    expect(mathjaxMocks.firstChild).toHaveBeenCalledTimes(1);
    expect(mathjaxMocks.serializeXML).toHaveBeenCalledTimes(1);
  });

  it('optimizes SVG with svgo', async () => {
    expect(await texsvg(tex2)).toBe(
      `optimize(serializeXML(firstChild(tex2svgPromise(${tex2}))))`,
    );
    expect(optimize).toHaveBeenCalledTimes(1);
    expect(optimize).toHaveBeenCalledWith(
      `serializeXML(firstChild(tex2svgPromise(${tex2})))`,
      svgoOptimizeOptions,
    );
  });
});

describe('optimize', () => {
  it('does not optimize SVG with svgo', async () => {
    expect(await texsvg(tex2, { optimize: false })).toBe(
      `serializeXML(firstChild(tex2svgPromise(${tex2})))`,
    );
    expect(optimize).not.toHaveBeenCalled();
  });
});
