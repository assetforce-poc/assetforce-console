/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    success\n    accessToken\n    refreshToken\n    expiresIn\n    tokenType\n    error\n    identityContext {\n      zone\n      realm\n      subject {\n        accountId\n        userId\n        username\n        email\n        displayName\n      }\n      groups\n    }\n  }\n}": typeof types.LoginDocument,
    "mutation RefreshToken($refreshToken: String!) {\n  refreshToken(refreshToken: $refreshToken) {\n    success\n    accessToken\n    refreshToken\n    expiresIn\n    tokenType\n    error\n    identityContext {\n      zone\n      realm\n      subject {\n        accountId\n        userId\n        username\n        email\n        displayName\n      }\n      groups\n    }\n  }\n}\n\nmutation Logout {\n  logout\n}\n\nquery CurrentSession {\n  currentSession {\n    sessionId\n    accountId\n    username\n    email\n    realm\n    isActive\n    createdAt\n    expiresAt\n    identityContext {\n      zone\n      realm\n      subject {\n        accountId\n        userId\n        username\n        email\n        displayName\n      }\n      groups\n    }\n  }\n}": typeof types.RefreshTokenDocument,
};
const documents: Documents = {
    "mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    success\n    accessToken\n    refreshToken\n    expiresIn\n    tokenType\n    error\n    identityContext {\n      zone\n      realm\n      subject {\n        accountId\n        userId\n        username\n        email\n        displayName\n      }\n      groups\n    }\n  }\n}": types.LoginDocument,
    "mutation RefreshToken($refreshToken: String!) {\n  refreshToken(refreshToken: $refreshToken) {\n    success\n    accessToken\n    refreshToken\n    expiresIn\n    tokenType\n    error\n    identityContext {\n      zone\n      realm\n      subject {\n        accountId\n        userId\n        username\n        email\n        displayName\n      }\n      groups\n    }\n  }\n}\n\nmutation Logout {\n  logout\n}\n\nquery CurrentSession {\n  currentSession {\n    sessionId\n    accountId\n    username\n    email\n    realm\n    isActive\n    createdAt\n    expiresAt\n    identityContext {\n      zone\n      realm\n      subject {\n        accountId\n        userId\n        username\n        email\n        displayName\n      }\n      groups\n    }\n  }\n}": types.RefreshTokenDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    success\n    accessToken\n    refreshToken\n    expiresIn\n    tokenType\n    error\n    identityContext {\n      zone\n      realm\n      subject {\n        accountId\n        userId\n        username\n        email\n        displayName\n      }\n      groups\n    }\n  }\n}"): (typeof documents)["mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    success\n    accessToken\n    refreshToken\n    expiresIn\n    tokenType\n    error\n    identityContext {\n      zone\n      realm\n      subject {\n        accountId\n        userId\n        username\n        email\n        displayName\n      }\n      groups\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation RefreshToken($refreshToken: String!) {\n  refreshToken(refreshToken: $refreshToken) {\n    success\n    accessToken\n    refreshToken\n    expiresIn\n    tokenType\n    error\n    identityContext {\n      zone\n      realm\n      subject {\n        accountId\n        userId\n        username\n        email\n        displayName\n      }\n      groups\n    }\n  }\n}\n\nmutation Logout {\n  logout\n}\n\nquery CurrentSession {\n  currentSession {\n    sessionId\n    accountId\n    username\n    email\n    realm\n    isActive\n    createdAt\n    expiresAt\n    identityContext {\n      zone\n      realm\n      subject {\n        accountId\n        userId\n        username\n        email\n        displayName\n      }\n      groups\n    }\n  }\n}"): (typeof documents)["mutation RefreshToken($refreshToken: String!) {\n  refreshToken(refreshToken: $refreshToken) {\n    success\n    accessToken\n    refreshToken\n    expiresIn\n    tokenType\n    error\n    identityContext {\n      zone\n      realm\n      subject {\n        accountId\n        userId\n        username\n        email\n        displayName\n      }\n      groups\n    }\n  }\n}\n\nmutation Logout {\n  logout\n}\n\nquery CurrentSession {\n  currentSession {\n    sessionId\n    accountId\n    username\n    email\n    realm\n    isActive\n    createdAt\n    expiresAt\n    identityContext {\n      zone\n      realm\n      subject {\n        accountId\n        userId\n        username\n        email\n        displayName\n      }\n      groups\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;