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
    // Handle feature-common subpath exports
    '^@assetforce/feature-common/fields$': '<rootDir>/../common/src/fields/index.ts',
    '^@assetforce/feature-common$': '<rootDir>/../common/src/index.ts',
    // Handle other internal package imports
    '^@assetforce/(.*)$': '<rootDir>/../../$1',
    // Mock next/server to avoid Request/Response issues in jsdom
    '^next/server$': '<rootDir>/__tests__/mocks/next-server.ts',
  },
  collectCoverageFrom: [
    'register/**/*.{ts,tsx}',
    '!register/**/index.ts',
    '!register/**/types.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 80,
      branches: 70,
    },
  },
};
