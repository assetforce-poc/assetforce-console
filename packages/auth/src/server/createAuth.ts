import type { AuthConfig } from '../types';

/**
 * AuthInstance - Auth instance interface
 */
export interface AuthInstance {
  /** API methods */
  api: {
    /** Get current session */
    getSession: (options: { headers: Headers }) => Promise<unknown>;
  };
  /** Handler for API routes */
  handler: (request: Request) => Promise<Response>;
}

/**
 * createAuth - Create auth instance
 *
 * @param config - Authentication configuration
 * @returns Auth instance
 *
 * @example
 * ```typescript
 * import { createAuth } from '@assetforce/auth/server';
 *
 * const auth = createAuth({
 *   aacEndpoint: process.env.AAC_GRAPHQL_ENDPOINT!,
 * });
 * ```
 */
export function createAuth(config: AuthConfig): AuthInstance {
  // TODO: Integrate Better Auth
  console.log('createAuth config:', config);

  return {
    api: {
      getSession: async ({ headers }) => {
        // TODO: Implement session retrieval
        console.log('getSession headers:', headers);
        return null;
      },
    },
    handler: async (request) => {
      // TODO: Implement request handler
      console.log('handler request:', request.url);
      return new Response('Not implemented', { status: 501 });
    },
  };
}
