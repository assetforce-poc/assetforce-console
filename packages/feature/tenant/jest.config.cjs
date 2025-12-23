/* eslint-disable */
/** @type {import('jest').Config} */
module.exports = {
  ...require('@assetforce/jest-config/react'),
  rootDir: '.',
  testMatch: ['<rootDir>/**/__tests__/**/*.test.{ts,tsx}'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    // Handle internal package imports
    '^@assetforce/graphql$': '<rootDir>/../../graphql/src/index.ts',
    '^@assetforce/material$': '<rootDir>/../../material/src/index.ts',
    '^@assetforce/(.*)$': '<rootDir>/../../$1',
  },
};
