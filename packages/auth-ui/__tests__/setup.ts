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

// Mock @assetforce/graphql - re-export Apollo Client essentials
jest.mock('@assetforce/graphql', () => {
  const apolloClient = jest.requireActual('@apollo/client');
  const apolloReact = jest.requireActual('@apollo/client/react');
  return {
    ApolloClient: apolloClient.ApolloClient,
    gql: apolloClient.gql,
    InMemoryCache: apolloClient.InMemoryCache,
    ApolloProvider: apolloReact.ApolloProvider,
    useLazyQuery: apolloReact.useLazyQuery,
    useMutation: apolloReact.useMutation,
    useQuery: apolloReact.useQuery,
    // Mock the proxy utilities that require Next.js server
    createGraphQLProxy: jest.fn(),
    createApolloClient: jest.fn(),
    ApolloClientProvider: jest.fn(),
  };
});
