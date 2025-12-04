// Re-export Apollo Client essentials
export { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation, useLazyQuery } from '@apollo/client';

// Export custom client factory
export { createApolloClient } from './client';

// Export provider wrapper
export { ApolloClientProvider } from './provider';

// Export proxy utilities
export { createGraphQLProxy } from './proxy';
export type { GraphQLProxyOptions } from './proxy';
