import { createGraphQLProxy } from '@assetforce/graphql';

const IMC_GRAPHQL_URL = process.env.IMC_GRAPHQL_URL || 'http://localhost:8082/graphql';
const handler = createGraphQLProxy(IMC_GRAPHQL_URL);

export const GET = handler;
export const POST = handler;
