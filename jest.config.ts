/**
 * Jest config for unit tests.
 *
 * @see https://jestjs.io/docs/en/configuration
 */
module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  preset: 'ts-jest',
  rootDir: 'src',
  testEnvironment: 'node',
};
