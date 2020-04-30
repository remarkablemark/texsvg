module.exports = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['<rootDir>/cjs/'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
