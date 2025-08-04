import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleFileExtensions: ['js', 'ts'],
  preset: 'ts-jest',
  reporters:
    process.env.CI === 'true'
      ? [['github-actions', { silent: false }], 'summary']
      : undefined,
  rootDir: 'src',
  testEnvironment: 'node',
};

export default config;
