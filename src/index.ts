import SVGO from 'svgo';
import mathjax from 'mathjax';

const svgo = new SVGO();

type Tex = string;
type Svg = string;

interface Tex2svg {
  (tex: Tex): Svg;
}

let tex2svg: Tex2svg;

const mathjaxConfig = {
  loader: {
    load: ['input/tex', 'output/svg'],
  },
};

/**
 * Converts TeX expression to SVG markup.
 */
async function texsvg(tex: string): Promise<string> {
  if (typeof tex !== 'string') {
    throw 'First argument must be a string';
  }

  if (!tex2svg) {
    const MathJax = await mathjax.init(mathjaxConfig);
    const { adaptor } = MathJax.startup;
    tex2svg = (tex: Tex): Svg => adaptor.innerHTML(MathJax.tex2svg(tex));
  }

  const svg = tex2svg(tex);

  const { data } = await svgo.optimize(svg);
  return data;
}

texsvg.default = texsvg;

export = texsvg;
