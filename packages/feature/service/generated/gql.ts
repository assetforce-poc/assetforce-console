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
    "query GetServiceDetail($input: ServiceOneInput!) {\n  service {\n    one(input: $input) {\n      id\n      slug\n      displayName\n      type\n      lifecycle\n      repoUrl\n      docsUrl\n      tags\n      health {\n        status\n        lastCheckedAt\n        lastSuccessAt\n        lastFailureAt\n      }\n      createdAt\n      updatedAt\n      dependencies {\n        target {\n          id\n          slug\n          displayName\n        }\n        critical\n      }\n      instances {\n        id\n        key\n        environment\n        baseUrl\n        healthPath\n        enabled\n        probeApprovalStatus\n        lastStatus\n        lastCheckedAt\n        lastFailureReason\n      }\n    }\n  }\n}": types.GetServiceDetailDocument,
    "query ListServices($input: ServiceListInput!) {\n  service {\n    list(input: $input) {\n      items {\n        id\n        slug\n        displayName\n        type\n        lifecycle\n        health {\n          status\n          lastCheckedAt\n        }\n        tags\n        createdAt\n        updatedAt\n      }\n      total\n      limit\n      offset\n    }\n  }\n}": types.ListServicesDocument,
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
export function gql(source: "query GetServiceDetail($input: ServiceOneInput!) {\n  service {\n    one(input: $input) {\n      id\n      slug\n      displayName\n      type\n      lifecycle\n      repoUrl\n      docsUrl\n      tags\n      health {\n        status\n        lastCheckedAt\n        lastSuccessAt\n        lastFailureAt\n      }\n      createdAt\n      updatedAt\n      dependencies {\n        target {\n          id\n          slug\n          displayName\n        }\n        critical\n      }\n      instances {\n        id\n        key\n        environment\n        baseUrl\n        healthPath\n        enabled\n        probeApprovalStatus\n        lastStatus\n        lastCheckedAt\n        lastFailureReason\n      }\n    }\n  }\n}"): (typeof documents)["query GetServiceDetail($input: ServiceOneInput!) {\n  service {\n    one(input: $input) {\n      id\n      slug\n      displayName\n      type\n      lifecycle\n      repoUrl\n      docsUrl\n      tags\n      health {\n        status\n        lastCheckedAt\n        lastSuccessAt\n        lastFailureAt\n      }\n      createdAt\n      updatedAt\n      dependencies {\n        target {\n          id\n          slug\n          displayName\n        }\n        critical\n      }\n      instances {\n        id\n        key\n        environment\n        baseUrl\n        healthPath\n        enabled\n        probeApprovalStatus\n        lastStatus\n        lastCheckedAt\n        lastFailureReason\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query ListServices($input: ServiceListInput!) {\n  service {\n    list(input: $input) {\n      items {\n        id\n        slug\n        displayName\n        type\n        lifecycle\n        health {\n          status\n          lastCheckedAt\n        }\n        tags\n        createdAt\n        updatedAt\n      }\n      total\n      limit\n      offset\n    }\n  }\n}"): (typeof documents)["query ListServices($input: ServiceListInput!) {\n  service {\n    list(input: $input) {\n      items {\n        id\n        slug\n        displayName\n        type\n        lifecycle\n        health {\n          status\n          lastCheckedAt\n        }\n        tags\n        createdAt\n        updatedAt\n      }\n      total\n      limit\n      offset\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;