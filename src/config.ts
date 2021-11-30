import type { OptimizeOptions } from 'svgo';

/**
 * @see {@link https://github.com/svg/svgo}
 */
export const svgoOptimizeOptions: OptimizeOptions = {
  plugins: [
    // default plugins
    'cleanupAttrs',
    'inlineStyles',
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeTitle',
    'removeDesc',
    'removeUselessDefs',
    'removeEditorsNSData',
    'removeEmptyAttrs',
    'removeHiddenElems',
    'removeEmptyText',
    'removeEmptyContainers',
    'removeViewBox',
    'cleanupEnableBackground',
    'minifyStyles',
    'convertStyleToAttrs',
    'convertColors',
    'convertPathData',
    'convertTransform',
    'removeUnknownsAndDefaults',
    'removeNonInheritableGroupAttrs',
    'removeUselessStrokeAndFill',
    'removeUnusedNS',
    'cleanupIDs',
    'cleanupNumericValues',
    'moveElemsAttrsToGroup',
    'moveGroupAttrsToElems',
    'collapseGroups',
    'mergePaths',
    'convertShapeToPath',
    'convertEllipseToCircle',
    'sortDefsChildren',

    // new plugins
    {
      // remove mathjax data attribute
      name: 'removeAttrs',
      params: { attrs: '(data-mml-node)' },
    },
  ],
};

/**
 * @see {@link https://github.com/mathjax/MathJax#using-mathjax-components-in-a-node-application}
 * @see {@link http://docs.mathjax.org/en/latest/web/configuration.html#loading-components-individually}
 */
export const mathjaxInitOptions = {
  loader: {
    load: ['input/tex', 'output/svg'],
  },
};
