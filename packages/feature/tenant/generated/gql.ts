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
    "query ValidateInvite($token: String!) {\n  tenant {\n    invite(token: $token) {\n      valid\n      invite {\n        id\n        tenantId\n        tenantName\n        invitedEmail\n        inviterEmail\n        role\n        message\n        status\n        expiresAt\n        createdAt\n        updatedAt\n      }\n      error {\n        code\n        message\n      }\n      auth {\n        required\n      }\n      email {\n        match\n        invited\n        current\n      }\n    }\n  }\n}\n\nquery ListInvites($input: InvitesInput!) {\n  tenant {\n    invites(input: $input) {\n      items {\n        id\n        tenantId\n        tenantName\n        invitedEmail\n        inviterEmail\n        role\n        status\n        message\n        expiresAt\n        createdAt\n        updatedAt\n      }\n      total\n      hasMore\n    }\n  }\n}\n\nmutation AcceptInvite($token: String!) {\n  tenant {\n    invite {\n      accept(token: $token) {\n        success\n        membership {\n          subject\n          tenant {\n            id\n            name\n          }\n          role\n          createdAt\n        }\n        error {\n          code\n          message\n        }\n      }\n    }\n  }\n}\n\nmutation SendInvite($input: InviteSendInput!) {\n  tenant {\n    invite {\n      send(input: $input) {\n        success\n        invite {\n          id\n          tenantId\n          tenantName\n          invitedEmail\n          role\n          expiresAt\n          createdAt\n        }\n        error {\n          code\n          message\n        }\n      }\n    }\n  }\n}\n\nmutation CancelInvite($id: String!) {\n  tenant {\n    invite {\n      cancel(id: $id) {\n        success\n        error {\n          code\n          message\n        }\n      }\n    }\n  }\n}\n\nmutation ResendInvite($id: String!) {\n  tenant {\n    invite {\n      resend(id: $id) {\n        success\n        cancelled {\n          id\n          status\n        }\n        created {\n          id\n          tenantId\n          tenantName\n          invitedEmail\n          role\n          expiresAt\n          createdAt\n        }\n        error {\n          code\n          message\n        }\n      }\n    }\n  }\n}": types.ValidateInviteDocument,
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
export function gql(source: "query ValidateInvite($token: String!) {\n  tenant {\n    invite(token: $token) {\n      valid\n      invite {\n        id\n        tenantId\n        tenantName\n        invitedEmail\n        inviterEmail\n        role\n        message\n        status\n        expiresAt\n        createdAt\n        updatedAt\n      }\n      error {\n        code\n        message\n      }\n      auth {\n        required\n      }\n      email {\n        match\n        invited\n        current\n      }\n    }\n  }\n}\n\nquery ListInvites($input: InvitesInput!) {\n  tenant {\n    invites(input: $input) {\n      items {\n        id\n        tenantId\n        tenantName\n        invitedEmail\n        inviterEmail\n        role\n        status\n        message\n        expiresAt\n        createdAt\n        updatedAt\n      }\n      total\n      hasMore\n    }\n  }\n}\n\nmutation AcceptInvite($token: String!) {\n  tenant {\n    invite {\n      accept(token: $token) {\n        success\n        membership {\n          subject\n          tenant {\n            id\n            name\n          }\n          role\n          createdAt\n        }\n        error {\n          code\n          message\n        }\n      }\n    }\n  }\n}\n\nmutation SendInvite($input: InviteSendInput!) {\n  tenant {\n    invite {\n      send(input: $input) {\n        success\n        invite {\n          id\n          tenantId\n          tenantName\n          invitedEmail\n          role\n          expiresAt\n          createdAt\n        }\n        error {\n          code\n          message\n        }\n      }\n    }\n  }\n}\n\nmutation CancelInvite($id: String!) {\n  tenant {\n    invite {\n      cancel(id: $id) {\n        success\n        error {\n          code\n          message\n        }\n      }\n    }\n  }\n}\n\nmutation ResendInvite($id: String!) {\n  tenant {\n    invite {\n      resend(id: $id) {\n        success\n        cancelled {\n          id\n          status\n        }\n        created {\n          id\n          tenantId\n          tenantName\n          invitedEmail\n          role\n          expiresAt\n          createdAt\n        }\n        error {\n          code\n          message\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query ValidateInvite($token: String!) {\n  tenant {\n    invite(token: $token) {\n      valid\n      invite {\n        id\n        tenantId\n        tenantName\n        invitedEmail\n        inviterEmail\n        role\n        message\n        status\n        expiresAt\n        createdAt\n        updatedAt\n      }\n      error {\n        code\n        message\n      }\n      auth {\n        required\n      }\n      email {\n        match\n        invited\n        current\n      }\n    }\n  }\n}\n\nquery ListInvites($input: InvitesInput!) {\n  tenant {\n    invites(input: $input) {\n      items {\n        id\n        tenantId\n        tenantName\n        invitedEmail\n        inviterEmail\n        role\n        status\n        message\n        expiresAt\n        createdAt\n        updatedAt\n      }\n      total\n      hasMore\n    }\n  }\n}\n\nmutation AcceptInvite($token: String!) {\n  tenant {\n    invite {\n      accept(token: $token) {\n        success\n        membership {\n          subject\n          tenant {\n            id\n            name\n          }\n          role\n          createdAt\n        }\n        error {\n          code\n          message\n        }\n      }\n    }\n  }\n}\n\nmutation SendInvite($input: InviteSendInput!) {\n  tenant {\n    invite {\n      send(input: $input) {\n        success\n        invite {\n          id\n          tenantId\n          tenantName\n          invitedEmail\n          role\n          expiresAt\n          createdAt\n        }\n        error {\n          code\n          message\n        }\n      }\n    }\n  }\n}\n\nmutation CancelInvite($id: String!) {\n  tenant {\n    invite {\n      cancel(id: $id) {\n        success\n        error {\n          code\n          message\n        }\n      }\n    }\n  }\n}\n\nmutation ResendInvite($id: String!) {\n  tenant {\n    invite {\n      resend(id: $id) {\n        success\n        cancelled {\n          id\n          status\n        }\n        created {\n          id\n          tenantId\n          tenantName\n          invitedEmail\n          role\n          expiresAt\n          createdAt\n        }\n        error {\n          code\n          message\n        }\n      }\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;