// Re-export Apollo Client essentials
export {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  useMutation,
  useLazyQuery,
} from "@apollo/client";

// Export custom client factory
export { createApolloClient } from "./client";

// Export hooks
export * from "./hooks";
