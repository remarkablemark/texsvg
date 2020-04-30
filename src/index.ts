import mathjax from 'mathjax';

let tex2svg: (tex: string) => string;

const config = {
  loader: {
    load: ['input/tex', 'output/svg'],
  },
};

/**
 * Converts TeX expression to SVG markup.
 */
const texsvg = (tex: string): Promise<string> => {
  if (typeof tex !== 'string') {
    return Promise.reject('First argument must be a string');
  }

  if (tex2svg) {
    return Promise.resolve(tex2svg(tex));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return mathjax.init(config).then((MathJax: any) => {
    const { adaptor } = MathJax.startup;
    tex2svg = (tex: string): string => {
      return adaptor.innerHTML(MathJax.tex2svg(tex));
    };
    return tex2svg(tex);
  });
};

texsvg.default = texsvg;

export = texsvg;
