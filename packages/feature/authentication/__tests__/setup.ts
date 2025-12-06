/**
 * Jest setup for @assetforce/authentication tests
 *
 * This file runs before each test file.
 */

// Import Jest DOM matchers
import '@testing-library/jest-dom';

// Suppress React 19 act() warnings in tests
// https://github.com/testing-library/react-testing-library/issues/1297
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

// Note: MSW server setup is disabled for unit tests.
// Unit tests use Apollo MockedProvider instead.
// MSW can be enabled for integration tests that need real HTTP mocking.
