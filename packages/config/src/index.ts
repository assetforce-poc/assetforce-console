// Environment configuration
export const config = {
  // AAC Backend
  aac: {
    graphqlEndpoint: process.env.NEXT_PUBLIC_AAC_GRAPHQL_ENDPOINT || "http://localhost:8081/graphql",
  },
  // IMC Backend
  imc: {
    graphqlEndpoint: process.env.NEXT_PUBLIC_IMC_GRAPHQL_ENDPOINT || "http://localhost:8082/graphql",
  },
  // Keycloak
  keycloak: {
    url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080",
    realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "assetforce",
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "assetforce-console",
  },
} as const;

export type Config = typeof config;
