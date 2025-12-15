/**
 * Test setup for @assetforce/auth-ui
 */

// Import jest-dom matchers
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock next/link - return a function component
jest.mock('next/link', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function Link({ children, href }: any) {
    return children;
  };
});
