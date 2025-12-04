// Re-export Apollo Client essentials
export { ApolloClient, ApolloProvider, gql, InMemoryCache, useLazyQuery, useMutation, useQuery } from '@apollo/client';

// Export custom client factory
export { createApolloClient } from './client';

// Export provider wrapper
export { ApolloClientProvider } from './provider';

// Export proxy utilities
export type { GraphQLProxyOptions } from './proxy';
export { createGraphQLProxy } from './proxy';
