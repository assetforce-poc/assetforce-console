'use client';

import { ApolloProvider } from '@apollo/client/react';
import { useMemo } from 'react';

import { createApolloClient } from './client';

interface ApolloClientProviderProps {
  children: React.ReactNode;
  endpoint?: string;
}

export function ApolloClientProvider({ children, endpoint = '/api/graphql' }: ApolloClientProviderProps) {
  // Use same-origin proxy to avoid CORS issues
  const client = useMemo(() => createApolloClient(endpoint), [endpoint]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
