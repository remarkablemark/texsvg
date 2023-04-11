# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 2.0.1 (2023-04-11)


### ⚠ BREAKING CHANGES

* **deps:** Node.js 14+ is required for version

### Features

* add tex to svg function that uses mathjax ([5dc3e44](https://github.com/remarkablemark/texsvg/commit/5dc3e44041603fbca583b585b66ce100572109e2))
* **bin:** add binary cli that outputs tex to svg to console or file ([f09015b](https://github.com/remarkablemark/texsvg/commit/f09015b487853c0ca640576893fdd7d99cf20b1d))
* **config:** set SVGO config so default YAML config isn't read ([c0ad7dc](https://github.com/remarkablemark/texsvg/commit/c0ad7dc757ddc6d68c7dc0b7fae991b6bf8efdf2))
* **package:** add "bin" field that maps `texsvg` to `./cjs/bin.js` ([8ca4ec4](https://github.com/remarkablemark/texsvg/commit/8ca4ec4daa368e73655416c83fd160e601948d8e))
* **texsvg:** optimize svg with svgo ([0425040](https://github.com/remarkablemark/texsvg/commit/0425040865da7af064aab4f1ddeec47145c6b8f4))
* throw svgo optimize error ([f760c3e](https://github.com/remarkablemark/texsvg/commit/f760c3e61a9616870635d29c8b58a67826d129b8)), closes [#61](https://github.com/remarkablemark/texsvg/issues/61)
* upgrade to svgo@2.8.0 ([4af91cd](https://github.com/remarkablemark/texsvg/commit/4af91cdf03ca1044c8a38716192f202447d2d08c))


### Bug Fixes

* **package:** bump mathjax version ([c60ad61](https://github.com/remarkablemark/texsvg/commit/c60ad6198a09347efc80375afaa4fdea455cbce9))


### Miscellaneous Chores

* release 1.5.1 ([f363ee8](https://github.com/remarkablemark/texsvg/commit/f363ee808287cceb20cc3535f5d527fe766ada24))


### Build System

* **deps:** bump svgo from 2.8.0 to 3.0.1 ([fb4fc2b](https://github.com/remarkablemark/texsvg/commit/fb4fc2b425a24e56191ade02a150108c133144ca))
* **deps:** bump svgo from 3.0.1 to 3.0.2 ([1fca8fe](https://github.com/remarkablemark/texsvg/commit/1fca8fe21e60d97b075a7f1488789620bced64a0))

## [2.0.1](https://github.com/remarkablemark/texsvg/compare/v2.0.0...v2.0.1) (2022-11-18)


### Build System

* **deps:** bump svgo from 3.0.1 to 3.0.2 ([1fca8fe](https://github.com/remarkablemark/texsvg/commit/1fca8fe21e60d97b075a7f1488789620bced64a0))

## [2.0.0](https://github.com/remarkablemark/texsvg/compare/v1.5.1...v2.0.0) (2022-11-12)


### ⚠ BREAKING CHANGES

* **deps:** Node.js 14+ is required for version

### Build System

* **deps:** bump svgo from 2.8.0 to 3.0.1 ([fb4fc2b](https://github.com/remarkablemark/texsvg/commit/fb4fc2b425a24e56191ade02a150108c133144ca))

## [1.5.1](https://github.com/remarkablemark/texsvg/compare/v1.5.0...v1.5.1) (2022-08-17)

### Build System

- bump @types/svgo from 2.6.3 to 2.6.4 ([aa69083](https://github.com/remarkablemark/texsvg/commit/aa690834b9da6debe2056d52288bea0a63ae8af8))

## [1.5.0](https://github.com/remarkablemark/texsvg/compare/v1.4.0...v1.5.0) (2022-06-11)

### Features

- throw svgo optimize error ([f760c3e](https://github.com/remarkablemark/texsvg/commit/f760c3e61a9616870635d29c8b58a67826d129b8)), closes [#61](https://github.com/remarkablemark/texsvg/issues/61)

## [1.4.0](https://www.github.com/remarkablemark/texsvg/compare/v1.3.1...v1.4.0) (2021-11-30)

### Features

- upgrade to svgo@2.8.0 ([4af91cd](https://www.github.com/remarkablemark/texsvg/commit/4af91cdf03ca1044c8a38716192f202447d2d08c))

## [1.3.1](https://github.com/remarkablemark/texsvg/compare/v1.3.0...v1.3.1) (2021-05-03)

### Bug Fixes

- **package:** bump mathjax version ([c60ad61](https://github.com/remarkablemark/texsvg/commit/c60ad6198a09347efc80375afaa4fdea455cbce9))

## [1.3.0](https://github.com/remarkablemark/texsvg/compare/v1.2.0...v1.3.0) (2020-05-16)

### Features

- **config:** set SVGO config so default YAML config isn't read ([c0ad7dc](https://github.com/remarkablemark/texsvg/commit/c0ad7dc757ddc6d68c7dc0b7fae991b6bf8efdf2))

## [1.2.0](https://github.com/remarkablemark/texsvg/compare/v1.1.0...v1.2.0) (2020-05-10)

### Features

- **bin:** add binary cli that outputs tex to svg to console or file ([f09015b](https://github.com/remarkablemark/texsvg/commit/f09015b487853c0ca640576893fdd7d99cf20b1d))
- **package:** add "bin" field that maps `texsvg` to `./cjs/bin.js` ([8ca4ec4](https://github.com/remarkablemark/texsvg/commit/8ca4ec4daa368e73655416c83fd160e601948d8e))

## [1.1.0](https://github.com/remarkablemark/texsvg/compare/v1.0.0...v1.1.0) (2020-05-01)

### Features

- **texsvg:** optimize svg with svgo ([0425040](https://github.com/remarkablemark/texsvg/commit/0425040865da7af064aab4f1ddeec47145c6b8f4))

## 1.0.0 (2020-04-30)

### Features

- add tex to svg function that uses mathjax ([5dc3e44](https://github.com/remarkablemark/texsvg/commit/5dc3e44041603fbca583b585b66ce100572109e2))
