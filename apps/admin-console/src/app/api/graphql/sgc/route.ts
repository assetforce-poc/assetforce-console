import { auth } from '@assetforce/auth/server';
import { createGraphQLProxy } from '@assetforce/graphql';

const SGC_GRAPHQL_URL = process.env.SGC_GRAPHQL_URL || 'http://localhost:8083/graphql';

const handler = createGraphQLProxy(SGC_GRAPHQL_URL, {
  getAccessToken: async (request) => {
    const { raw } = await auth.api.getSession({ headers: request.headers });
    return raw.accessToken || null;
  },
});

export const GET = handler;
export const POST = handler;
