/* eslint-disable */
/** @type {import('jest').Config} */
module.exports = {
  ...require('@assetforce/jest-config/node'),
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 70,
      branches: 60,
    },
  },
};
