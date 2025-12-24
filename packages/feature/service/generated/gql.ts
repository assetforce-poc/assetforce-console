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
    "mutation UpsertGraphQLContract($input: GraphQLContractUpsertInput!) {\n  service {\n    contract {\n      upsertGraphQL(input: $input) {\n        ...ServiceContractFields\n      }\n    }\n  }\n}\n\nmutation DeprecateContract($input: ContractDeprecateInput!) {\n  service {\n    contract {\n      deprecate(input: $input) {\n        ...ServiceContractFields\n      }\n    }\n  }\n}\n\nmutation DeleteContract($id: ID!) {\n  service {\n    contract {\n      delete(id: $id)\n    }\n  }\n}": types.UpsertGraphQlContractDocument,
    "fragment ServiceContractFields on ServiceContract {\n  id\n  tenant\n  serviceId\n  type\n  protocol\n  graphql {\n    operation\n    schema {\n      url\n      hash\n      version\n    }\n  }\n  version\n  deprecation {\n    reason\n    since\n    alternative\n    removal\n  }\n  deprecated\n  createdAt\n  updatedAt\n}\n\nquery ListContracts($input: ContractListInput!) {\n  service {\n    contract {\n      list(input: $input) {\n        items {\n          ...ServiceContractFields\n        }\n        total\n        limit\n        offset\n      }\n    }\n  }\n}\n\nquery GetContract($id: ID!) {\n  service {\n    contract {\n      one(id: $id) {\n        ...ServiceContractFields\n      }\n    }\n  }\n}": types.ServiceContractFieldsFragmentDoc,
    "fragment ServiceIdentityFields on Service {\n  id\n  slug\n  displayName\n  type\n}\n\nfragment ServiceContractSummary on ServiceContract {\n  id\n  type\n  protocol\n  graphql {\n    operation\n  }\n  deprecated\n}\n\nfragment ProvidesNodeFields on ProvidesNode {\n  contract {\n    ...ServiceContractSummary\n  }\n  consumers {\n    ...ServiceIdentityFields\n  }\n}\n\nfragment ConsumesNodeFields on ConsumesNode {\n  contract {\n    ...ServiceContractSummary\n  }\n  providers {\n    ...ServiceIdentityFields\n  }\n}\n\nquery GetDependencyGraph($input: DependencyGraphInput!) {\n  service {\n    contract {\n      dependencies(input: $input) {\n        service {\n          ...ServiceIdentityFields\n        }\n        provides {\n          ...ProvidesNodeFields\n        }\n        consumes {\n          ...ConsumesNodeFields\n        }\n      }\n    }\n  }\n}": types.ServiceIdentityFieldsFragmentDoc,
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
export function gql(source: "mutation UpsertGraphQLContract($input: GraphQLContractUpsertInput!) {\n  service {\n    contract {\n      upsertGraphQL(input: $input) {\n        ...ServiceContractFields\n      }\n    }\n  }\n}\n\nmutation DeprecateContract($input: ContractDeprecateInput!) {\n  service {\n    contract {\n      deprecate(input: $input) {\n        ...ServiceContractFields\n      }\n    }\n  }\n}\n\nmutation DeleteContract($id: ID!) {\n  service {\n    contract {\n      delete(id: $id)\n    }\n  }\n}"): (typeof documents)["mutation UpsertGraphQLContract($input: GraphQLContractUpsertInput!) {\n  service {\n    contract {\n      upsertGraphQL(input: $input) {\n        ...ServiceContractFields\n      }\n    }\n  }\n}\n\nmutation DeprecateContract($input: ContractDeprecateInput!) {\n  service {\n    contract {\n      deprecate(input: $input) {\n        ...ServiceContractFields\n      }\n    }\n  }\n}\n\nmutation DeleteContract($id: ID!) {\n  service {\n    contract {\n      delete(id: $id)\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment ServiceContractFields on ServiceContract {\n  id\n  tenant\n  serviceId\n  type\n  protocol\n  graphql {\n    operation\n    schema {\n      url\n      hash\n      version\n    }\n  }\n  version\n  deprecation {\n    reason\n    since\n    alternative\n    removal\n  }\n  deprecated\n  createdAt\n  updatedAt\n}\n\nquery ListContracts($input: ContractListInput!) {\n  service {\n    contract {\n      list(input: $input) {\n        items {\n          ...ServiceContractFields\n        }\n        total\n        limit\n        offset\n      }\n    }\n  }\n}\n\nquery GetContract($id: ID!) {\n  service {\n    contract {\n      one(id: $id) {\n        ...ServiceContractFields\n      }\n    }\n  }\n}"): (typeof documents)["fragment ServiceContractFields on ServiceContract {\n  id\n  tenant\n  serviceId\n  type\n  protocol\n  graphql {\n    operation\n    schema {\n      url\n      hash\n      version\n    }\n  }\n  version\n  deprecation {\n    reason\n    since\n    alternative\n    removal\n  }\n  deprecated\n  createdAt\n  updatedAt\n}\n\nquery ListContracts($input: ContractListInput!) {\n  service {\n    contract {\n      list(input: $input) {\n        items {\n          ...ServiceContractFields\n        }\n        total\n        limit\n        offset\n      }\n    }\n  }\n}\n\nquery GetContract($id: ID!) {\n  service {\n    contract {\n      one(id: $id) {\n        ...ServiceContractFields\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment ServiceIdentityFields on Service {\n  id\n  slug\n  displayName\n  type\n}\n\nfragment ServiceContractSummary on ServiceContract {\n  id\n  type\n  protocol\n  graphql {\n    operation\n  }\n  deprecated\n}\n\nfragment ProvidesNodeFields on ProvidesNode {\n  contract {\n    ...ServiceContractSummary\n  }\n  consumers {\n    ...ServiceIdentityFields\n  }\n}\n\nfragment ConsumesNodeFields on ConsumesNode {\n  contract {\n    ...ServiceContractSummary\n  }\n  providers {\n    ...ServiceIdentityFields\n  }\n}\n\nquery GetDependencyGraph($input: DependencyGraphInput!) {\n  service {\n    contract {\n      dependencies(input: $input) {\n        service {\n          ...ServiceIdentityFields\n        }\n        provides {\n          ...ProvidesNodeFields\n        }\n        consumes {\n          ...ConsumesNodeFields\n        }\n      }\n    }\n  }\n}"): (typeof documents)["fragment ServiceIdentityFields on Service {\n  id\n  slug\n  displayName\n  type\n}\n\nfragment ServiceContractSummary on ServiceContract {\n  id\n  type\n  protocol\n  graphql {\n    operation\n  }\n  deprecated\n}\n\nfragment ProvidesNodeFields on ProvidesNode {\n  contract {\n    ...ServiceContractSummary\n  }\n  consumers {\n    ...ServiceIdentityFields\n  }\n}\n\nfragment ConsumesNodeFields on ConsumesNode {\n  contract {\n    ...ServiceContractSummary\n  }\n  providers {\n    ...ServiceIdentityFields\n  }\n}\n\nquery GetDependencyGraph($input: DependencyGraphInput!) {\n  service {\n    contract {\n      dependencies(input: $input) {\n        service {\n          ...ServiceIdentityFields\n        }\n        provides {\n          ...ProvidesNodeFields\n        }\n        consumes {\n          ...ConsumesNodeFields\n        }\n      }\n    }\n  }\n}"];
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