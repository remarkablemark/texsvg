declare module 'mathjax' {
  interface MathJaxAdaptor {
    innerHTML: (element: unknown) => string;
  }

  interface MathJaxStartup {
    adaptor: MathJaxAdaptor;
  }

  interface MathJaxObject {
    startup: MathJaxStartup;
    tex2svg: (tex: string) => unknown;
  }

  type MathJaxInitFunction = (options: unknown) => Promise<MathJaxObject>;

  interface MathJaxModule {
    init: MathJaxInitFunction;
  }

  const mathjax: MathJaxModule;
  export = mathjax;
}
