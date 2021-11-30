import { optimize } from 'svgo';
import mathjax from 'mathjax';
import { mathjaxInitOptions, svgoOptimizeOptions } from './config';

let tex2svg: (tex: string) => string;

/**
 * Converts TeX expression to SVG markup.
 *
 * @param tex - The TeX string.
 * @return - The promise containing the SVG when fulfilled.
 */
async function texsvg(tex: string): Promise<string> {
  if (typeof tex !== 'string') {
    throw new TypeError('First argument must be a string');
  }

  if (!tex2svg) {
    const MathJax = await mathjax.init(mathjaxInitOptions);
    // memoize
    tex2svg = (tex: string) =>
      MathJax.startup.adaptor.innerHTML(MathJax.tex2svg(tex));
  }

  const svg = tex2svg(tex);
  const result = optimize(svg, svgoOptimizeOptions);
  return result.data;
}

// support both ES Modules and CommonJS
texsvg.default = texsvg;
export = texsvg;
