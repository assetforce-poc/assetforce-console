// Re-export Apollo Client essentials
export { ApolloClient, gql, InMemoryCache } from '@apollo/client';
export { ApolloProvider, useLazyQuery, useMutation, useQuery } from '@apollo/client/react';

// Export custom client factory
export { createApolloClient } from './client';

// Export provider wrapper
export { ApolloClientProvider } from './provider';

// Export proxy utilities
export type { GraphQLProxyOptions } from './proxy';
export { createGraphQLProxy } from './proxy';

// Export shared GraphQL types
export type { DeepOmit } from './types';
