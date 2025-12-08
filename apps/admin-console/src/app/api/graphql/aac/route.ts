import { createGraphQLProxy } from '@assetforce/graphql';

const AAC_GRAPHQL_URL = process.env.AAC_GRAPHQL_URL || 'http://localhost:8081/graphql';
const handler = createGraphQLProxy(AAC_GRAPHQL_URL);

export const GET = handler;
export const POST = handler;
