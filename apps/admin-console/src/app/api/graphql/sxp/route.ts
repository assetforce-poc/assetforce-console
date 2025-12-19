import { createGraphQLProxy } from '@assetforce/graphql';

const SXP_GRAPHQL_URL = process.env.SXP_GRAPHQL_URL || 'http://localhost:8084/graphql';
const handler = createGraphQLProxy(SXP_GRAPHQL_URL);

export const GET = handler;
export const POST = handler;
