/* eslint-disable */
/** @type {import('jest').Config} */
module.exports = {
  ...require('@assetforce/jest-config/react'),
  rootDir: '.',
  testMatch: ['<rootDir>/__tests__/**/*.test.{ts,tsx}'],
  setupFilesAfterEnv: [
    '@testing-library/jest-dom',
    '<rootDir>/__tests__/setup.ts',
  ],
  moduleNameMapper: {
    // Handle internal package imports
    '^@assetforce/material$': '<rootDir>/../material/src/index.ts',
    '^@assetforce/auth$': '<rootDir>/../auth/src/index.ts',
    '^@assetforce/graphql$': '<rootDir>/../graphql/src/index.ts',
    '^@assetforce/(.*)$': '<rootDir>/../../$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/index.ts',
    '!src/**/types.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 70,
      branches: 60,
    },
  },
};
