declare module 'mathjax' {
  interface MathJaxAdaptor {
    innerHTML: (element: unknown) => string;
    serializeXML: (element: unknown) => string;
  }

  interface MathJaxStartup {
    adaptor: MathJaxAdaptor;
    promise: Promise<void>;
  }

  interface MathJaxModule {
    init: (options: unknown) => Promise<MathJaxModule>;
    startup: MathJaxStartup;
    tex2svg: (tex: string) => unknown;
    tex2svgPromise: (tex: string, options?: unknown) => Promise<unknown>;
  }

  const mathjax: MathJaxModule;
  export = mathjax;
}
