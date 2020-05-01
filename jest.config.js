/**
 * Jest config for unit tests.
 *
 * @see https://jestjs.io/docs/en/configuration
 */
module.exports = {
  rootDir: 'src',
  testEnvironment: 'node',
  preset: 'ts-jest',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
