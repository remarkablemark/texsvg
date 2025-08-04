import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'ts'],
  preset: 'ts-jest',
  reporters:
    process.env.CI === 'true'
      ? [['github-actions', { silent: false }], 'summary']
      : undefined,
  rootDir: 'test',
  testEnvironment: 'node',
};

export default config;
