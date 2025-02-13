import { optimize } from 'svgo';
import mathjax from 'mathjax';
import { mathjaxInitOptions, svgoOptimizeOptions } from './config';

let tex2svg: (tex: string) => string;

/**
 * Converts TeX expression to SVG markup.
 *
 * @param tex - The TeX string.
 * @param options - The options.
 * @returns - The promise containing the SVG when fulfilled.
 */
async function texsvg(
  tex: string,
  options = { optimize: true },
): Promise<string> {
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

  if (options.optimize) {
    return optimize(svg, svgoOptimizeOptions).data;
  } else {
    return svg;
  }
}

// support both ES Modules and CommonJS
texsvg.default = texsvg;
export = texsvg;
