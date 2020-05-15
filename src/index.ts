import SVGO from 'svgo';
import mathjax from 'mathjax';
import { mathjax as mathjaxConfig } from './config';

const svgo = new SVGO();

type Tex = string;
type Svg = string;

let tex2svg: (tex: Tex) => Svg;

/**
 * Converts TeX expression to SVG markup.
 *
 * @param {string} tex - The TeX.
 * @return {Promise<string>} - The promise containing the SVG when fulfilled.
 */
async function texsvg(tex: Tex): Promise<Svg> {
  // validate argument
  if (typeof tex !== 'string') {
    throw 'First argument must be a string';
  }

  // memoize mathjax method
  if (!tex2svg) {
    const {
      tex2svg: mathjaxTexToSvg,
      startup: { adaptor: mathjaxAdaptor },
    } = await mathjax.init(mathjaxConfig);
    tex2svg = (tex: Tex): Svg => mathjaxAdaptor.innerHTML(mathjaxTexToSvg(tex));
  }

  // convert TeX to SVG
  const svg = tex2svg(tex);

  // optimize SVG
  const { data } = await svgo.optimize(svg);
  return data;
}

// support both ES Modules and CommonJS
texsvg.default = texsvg;
export = texsvg;
