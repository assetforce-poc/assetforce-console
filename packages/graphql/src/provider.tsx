'use client';

import { ApolloProvider } from '@apollo/client';
import { useMemo } from 'react';

import { createApolloClient } from './client';
export function ApolloClientProvider({ children }: { children: React.ReactNode }) {
  // Use same-origin proxy to avoid CORS issues
  const client = useMemo(() => createApolloClient('/api/graphql'), []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
