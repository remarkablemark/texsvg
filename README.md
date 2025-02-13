# texsvg

[![NPM](https://nodei.co/npm/texsvg.png)](https://nodei.co/npm/texsvg/)

[![NPM version](https://img.shields.io/npm/v/texsvg.svg)](https://www.npmjs.com/package/texsvg)
[![build](https://github.com/remarkablemark/texsvg/actions/workflows/build.yml/badge.svg)](https://github.com/remarkablemark/texsvg/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/remarkablemark/texsvg/branch/master/graph/badge.svg?token=BC34P2RTJB)](https://codecov.io/gh/remarkablemark/texsvg)

Convert [TeX](https://wikipedia.org/wiki/TeX) to [SVG](https://wikipedia.org/wiki/Scalable_Vector_Graphics) using [MathJax](https://www.mathjax.org/) and [SVGO](https://github.com/svg/svgo):

```
texsvg(string)
```

## Quick Start

CLI:

```sh
npx texsvg '\frac{a}{b}' fraction.svg
```

Script:

```js
const texsvg = require('texsvg');

texsvg('\\frac{a}{b}').then((svg) => console.log(svg));
```

## Installation

### Module

[NPM](https://www.npmjs.com/package/texsvg):

```sh
npm install texsvg
```

[Yarn](https://yarnpkg.com/package/texsvg):

```sh
yarn add texsvg
```

### CLI

NPM:

```sh
npm install --global texsvg
```

Yarn:

```sh
yarn global add texsvg
```

NPX:

```sh
npx texsvg
```

## Usage

### Module

Import with ES Modules:

```js
import texsvg from 'texsvg';
```

Or require with CommonJS:

```js
const texsvg = require('texsvg');
```

Convert TeX to SVG using [async-await](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function):

```js
const quadraticFormula = 'x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}';

(async () => {
  try {
    const svg = await texsvg(quadraticFormula);
    console.log(svg);
  } catch (err) {
    console.error(err);
  }
})();
```

Convert TeX to SVG using [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise):

```js
const quadraticFormula = 'x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}';

texsvg(quadraticFormula)
  .then((svg) => console.log(svg))
  .catch((err) => console.error(err));
```

### CLI

Usage:

```sh
texsvg <tex> <file>
```

Convert TeX to SVG and log result to console:

```sh
texsvg '\frac{a}{b}'
```

Convert TeX to SVG and save result to file:

```sh
texsvg '\frac{a}{b}' fraction.svg
```

## Testing

Run tests with coverage:

```sh
npm test
```

Run tests in watch mode:

```sh
npm run test:watch
```

Run integration tests:

```sh
npm run test:integration
```

Lint files:

```sh
npm run lint
npm run lint:tsc
```

Fix lint errors:

```sh
npm run lint:fix
```

## Examples

- [StackBlitz (Script)](https://stackblitz.com/edit/texsvg)
- [StackBlitz (Server)](https://stackblitz.com/edit/texsvg-server)
- [texsvg-server](https://github.com/remarkablemark/texsvg-server)
- [JSFiddle](https://jsfiddle.net/remarkablemark/1k7t6s9o/)

## Release

Release is automated with [Release Please](https://github.com/googleapis/release-please).

## License

[MIT](https://github.com/remarkablemark/texsvg/blob/master/LICENSE)
