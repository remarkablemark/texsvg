import mathjax from 'mathjax';
import { optimize } from 'svgo';
import { mathjaxInitOptions, svgoOptimizeOptions } from './config';

let tex2svg: ((tex: string) => Promise<string>) | undefined;

/**
 * Converts TeX expression to SVG markup.
 *
 * @param tex - The TeX string.
 * @param options - The options.
 * @returns - The promise containing the SVG when fulfilled.
 */
export async function texsvg(
  tex: string,
  options = { optimize: true },
): Promise<string> {
  if (typeof tex !== 'string') {
    throw new TypeError('First argument must be a string');
  }

  if (!tex2svg) {
    await mathjax.init(mathjaxInitOptions);
    await mathjax.startup.promise;

    // memoize
    tex2svg = async (tex: string) => {
      const node = await mathjax.tex2svgPromise(tex);
      const adaptor = mathjax.startup.adaptor;

      // Extract the SVG element from the mjx-container wrapper
      const svgNode = adaptor.firstChild(node);
      return adaptor.serializeXML(svgNode);
    };
  }

  const svg = await tex2svg(tex);

  if (options.optimize) {
    return optimize(svg, svgoOptimizeOptions).data;
  }

  return svg;
}
