/**
 * @see {@link https://github.com/svg/svgo}
 */
export const svgo = {
  full: true, // skip reading default YAML config
  plugins: [
    // default plugins
    {
      cleanupAttrs: true,
    },
    {
      inlineStyles: true,
    },
    {
      removeDoctype: true,
    },
    {
      removeXMLProcInst: true,
    },
    {
      removeComments: true,
    },
    {
      removeMetadata: true,
    },
    {
      removeTitle: true,
    },
    {
      removeDesc: true,
    },
    {
      removeUselessDefs: true,
    },
    {
      removeEditorsNSData: true,
    },
    {
      removeEmptyAttrs: true,
    },
    {
      removeHiddenElems: true,
    },
    {
      removeEmptyText: true,
    },
    {
      removeEmptyContainers: true,
    },
    {
      removeViewBox: true,
    },
    {
      cleanupEnableBackground: true,
    },
    {
      minifyStyles: true,
    },
    {
      convertStyleToAttrs: true,
    },
    {
      convertColors: true,
    },
    {
      convertPathData: true,
    },
    {
      convertTransform: true,
    },
    {
      removeUnknownsAndDefaults: true,
    },
    {
      removeNonInheritableGroupAttrs: true,
    },
    {
      removeUselessStrokeAndFill: true,
    },
    {
      removeUnusedNS: true,
    },
    {
      cleanupIDs: true,
    },
    {
      cleanupNumericValues: true,
    },
    {
      moveElemsAttrsToGroup: true,
    },
    {
      moveGroupAttrsToElems: true,
    },
    {
      collapseGroups: true,
    },
    {
      mergePaths: true,
    },
    {
      convertShapeToPath: true,
    },
    {
      convertEllipseToCircle: true,
    },
    {
      sortDefsChildren: true,
    },

    // new plugins
    {
      // remove mathjax data attribute
      removeAttrs: { attrs: '(data-mml-node)' },
    },
  ],
};

/**
 * @see {@link http://docs.mathjax.org/en/latest/web/configuration.html#loading-components-individually}
 */
export const mathjax = {
  loader: {
    load: ['input/tex', 'output/svg'],
  },
};
