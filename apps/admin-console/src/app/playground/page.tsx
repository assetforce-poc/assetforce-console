'use client';

import 'graphiql/graphiql.css';

import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import { useMemo } from 'react';

export const dynamic = 'force-dynamic';

/**
 * GraphQL Playground Page
 *
 * Integrated GraphiQL playground for testing cross-service queries
 * through the SXP (Service Exchange Portal) Gateway.
 *
 * Features:
 * - Schema Explorer (auto-loaded supergraph schema)
 * - Query history and favorites
 * - Cross-service federation queries (AAC + IMC + SGC)
 */
export default function PlaygroundPage() {
  const fetcher = useMemo(
    () =>
      typeof window === 'undefined'
        ? null
        : createGraphiQLFetcher({
            url: '/api/graphql/sxp',
          }),
    []
  );

  if (!fetcher) {
    return null;
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GraphiQL
        fetcher={fetcher}
        defaultQuery={`# Welcome to GraphQL Playground!
#
# This playground connects to the SXP Gateway, allowing you to query
# across all federated services (AAC, IMC, SGC).
#
# Try this example query:
#
# query ExampleQuery {
#   service {
#     list {
#       id
#       displayName
#       status
#     }
#   }
# }
#
# Use the Doc Explorer (Docs) to browse the complete schema.
`}
      />
    </div>
  );
}
