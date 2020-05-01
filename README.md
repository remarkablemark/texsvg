# texsvg

[![NPM](https://nodei.co/npm/texsvg.png)](https://nodei.co/npm/texsvg/)

[![NPM version](https://img.shields.io/npm/v/texsvg.svg)](https://www.npmjs.com/package/texsvg)
[![Build Status](https://travis-ci.org/remarkablemark/texsvg.svg?branch=master)](https://travis-ci.org/remarkablemark/texsvg)
[![Coverage Status](https://coveralls.io/repos/github/remarkablemark/texsvg/badge.svg?branch=master)](https://coveralls.io/github/remarkablemark/texsvg?branch=master)
[![Dependency status](https://david-dm.org/remarkablemark/texsvg.svg)](https://david-dm.org/remarkablemark/texsvg)

Converts [TeX](https://en.wikipedia.org/wiki/TeX) to [SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics) using [MathJax](https://www.mathjax.org/) and [SVGO](https://github.com/svg/svgo):

```
texsvg(string)
```

#### Example:

```js
const texsvg = require('texsvg');

texsvg('\\frac{a}{b}').then((svg) => console.log(svg));
```

[Node.js](https://repl.it/@remarkablemark/texsvg) | [Server](https://repl.it/@remarkablemark/texsvg-server)

## Installation

[NPM](https://www.npmjs.com/package/texsvg):

```sh
$ npm install texsvg --save
```

[Yarn](https://yarnpkg.com/package/texsvg):

```sh
$ yarn add texsvg
```

## Usage

Import module:

```js
// CommonJS
const texsvg = require('texsvg');

// ES Modules
import texsvg from 'texsvg';
```

Render TeX to SVG using [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise):

```js
const quadraticFormula = 'x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}';

texsvg(quadraticFormula)
  .then((svg) => console.log(svg))
  .catch((err) => console.error(err));
```

Render TeX to SVG using [async-await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise):

```js
const quadraticFormula = 'x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}';

(async function () {
  try {
    const svg = await texsvg(quadraticFormula);
    console.log(svg);
  } catch (err) {
    console.error(err);
  }
})();
```

## Testing

Run tests with coverage:

```sh
$ npm test
```

Run tests in watch mode:

```sh
$ npm run test:watch
```

Run integration tests:

```sh
$ npm run test:integration
```

Lint files:

```sh
$ npm run lint
$ npm run lint:tsc
```

Fix lint errors:

```sh
$ npm run lint:fix
```

## Release

Only collaborators with credentials can release and publish:

```sh
$ npm run release
$ git push --follow-tags && npm publish
```

## License

[MIT](https://github.com/remarkablemark/texsvg/blob/master/LICENSE)
