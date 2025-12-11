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
 */
const documents = {
    "query GetAccountDetail($id: String!) {\n  account {\n    one(id: $id) {\n      id\n      username\n      email\n      status\n      emailVerified\n      createdAt\n      updatedAt\n      firstName\n      lastName\n      attributes {\n        key\n        value\n        isSensitive\n      }\n      sessions {\n        id\n        ipAddress\n        userAgent\n        start\n        lastAccess\n      }\n    }\n  }\n}": types.GetAccountDetailDocument,
    "mutation VerifyEmailByAdmin($accountId: String!) {\n  verifyEmailByAdmin(accountId: $accountId) {\n    success\n    message\n  }\n}": types.VerifyEmailByAdminDocument,
    "query ListAccounts($status: AccountStatus, $queries: ListQueriesInput) {\n  account {\n    list(status: $status, queries: $queries) {\n      items {\n        id\n        username\n        email\n        status\n        emailVerified\n        createdAt\n      }\n      total\n      pagination {\n        current\n        size\n        total\n        hasNext\n        hasPrev\n      }\n    }\n  }\n}": types.ListAccountsDocument,
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
export function gql(source: "query GetAccountDetail($id: String!) {\n  account {\n    one(id: $id) {\n      id\n      username\n      email\n      status\n      emailVerified\n      createdAt\n      updatedAt\n      firstName\n      lastName\n      attributes {\n        key\n        value\n        isSensitive\n      }\n      sessions {\n        id\n        ipAddress\n        userAgent\n        start\n        lastAccess\n      }\n    }\n  }\n}"): (typeof documents)["query GetAccountDetail($id: String!) {\n  account {\n    one(id: $id) {\n      id\n      username\n      email\n      status\n      emailVerified\n      createdAt\n      updatedAt\n      firstName\n      lastName\n      attributes {\n        key\n        value\n        isSensitive\n      }\n      sessions {\n        id\n        ipAddress\n        userAgent\n        start\n        lastAccess\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation VerifyEmailByAdmin($accountId: String!) {\n  verifyEmailByAdmin(accountId: $accountId) {\n    success\n    message\n  }\n}"): (typeof documents)["mutation VerifyEmailByAdmin($accountId: String!) {\n  verifyEmailByAdmin(accountId: $accountId) {\n    success\n    message\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query ListAccounts($status: AccountStatus, $queries: ListQueriesInput) {\n  account {\n    list(status: $status, queries: $queries) {\n      items {\n        id\n        username\n        email\n        status\n        emailVerified\n        createdAt\n      }\n      total\n      pagination {\n        current\n        size\n        total\n        hasNext\n        hasPrev\n      }\n    }\n  }\n}"): (typeof documents)["query ListAccounts($status: AccountStatus, $queries: ListQueriesInput) {\n  account {\n    list(status: $status, queries: $queries) {\n      items {\n        id\n        username\n        email\n        status\n        emailVerified\n        createdAt\n      }\n      total\n      pagination {\n        current\n        size\n        total\n        hasNext\n        hasPrev\n      }\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;