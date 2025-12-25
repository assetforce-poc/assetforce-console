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
    "mutation ActivateAccount($input: ActivateAccountInput!) {\n  account {\n    activation {\n      activate(input: $input) {\n        success\n        tokens {\n          accessToken\n          refreshToken\n          expiresIn\n          tokenType\n        }\n        error {\n          code\n          message\n          passwordErrors\n        }\n      }\n    }\n  }\n}": types.ActivateAccountDocument,
    "query ValidateActivationToken($token: String!) {\n  account {\n    activation {\n      validate(token: $token) {\n        valid\n        email\n        expiresAt\n        error {\n          code\n          message\n        }\n      }\n    }\n  }\n}": types.ValidateActivationTokenDocument,
    "mutation AuthenticateEnter($subject: String!, $tenantId: String!) {\n  authenticate {\n    enter(subject: $subject, tenantId: $tenantId) {\n      success\n      accessToken\n      refreshToken\n      expiresIn\n      tokenType\n      identityContext {\n        zone\n        tenant\n        subject {\n          accountId\n          userId\n          username\n          email\n          displayName\n        }\n        groups\n      }\n      error\n    }\n  }\n}": types.AuthenticateEnterDocument,
    "mutation AuthenticateLogin($username: String!, $password: String!, $tenant: String) {\n  authenticate {\n    login(username: $username, password: $password, tenant: $tenant) {\n      success\n      subject\n      tenants {\n        id\n        name\n        displayName\n        zoneId\n        type\n        description\n        isActive\n      }\n      accessToken\n      refreshToken\n      expiresIn\n      tokenType\n      identityContext {\n        zone\n        tenant\n        subject {\n          accountId\n          userId\n          username\n          email\n          displayName\n        }\n        groups\n      }\n      error\n    }\n  }\n}": types.AuthenticateLoginDocument,
    "query CheckEmailAvailabilityInRegistration($email: String!) {\n  registration {\n    email(address: $email) {\n      available\n      reason\n    }\n  }\n}": types.CheckEmailAvailabilityInRegistrationDocument,
    "mutation RegisterInRegistration($input: RegisterInput!) {\n  registration {\n    register(input: $input) {\n      success\n      accountId\n      message\n      requiresVerification\n      appliedTenant\n    }\n  }\n}": types.RegisterInRegistrationDocument,
    "mutation VerifyEmailInRegistration($token: String!) {\n  registration {\n    verifyEmail(token: $token) {\n      success\n      message\n      accountId\n      tenantStatus {\n        hasTenants\n        requiresTenantSelection\n        pendingApproval\n        activeTenants\n      }\n    }\n  }\n}": types.VerifyEmailInRegistrationDocument,
    "mutation ResendVerificationEmailInRegistration($email: String!) {\n  registration {\n    resendVerificationEmail(email: $email) {\n      success\n      message\n    }\n  }\n}": types.ResendVerificationEmailInRegistrationDocument,
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
export function gql(source: "mutation ActivateAccount($input: ActivateAccountInput!) {\n  account {\n    activation {\n      activate(input: $input) {\n        success\n        tokens {\n          accessToken\n          refreshToken\n          expiresIn\n          tokenType\n        }\n        error {\n          code\n          message\n          passwordErrors\n        }\n      }\n    }\n  }\n}"): (typeof documents)["mutation ActivateAccount($input: ActivateAccountInput!) {\n  account {\n    activation {\n      activate(input: $input) {\n        success\n        tokens {\n          accessToken\n          refreshToken\n          expiresIn\n          tokenType\n        }\n        error {\n          code\n          message\n          passwordErrors\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query ValidateActivationToken($token: String!) {\n  account {\n    activation {\n      validate(token: $token) {\n        valid\n        email\n        expiresAt\n        error {\n          code\n          message\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query ValidateActivationToken($token: String!) {\n  account {\n    activation {\n      validate(token: $token) {\n        valid\n        email\n        expiresAt\n        error {\n          code\n          message\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation AuthenticateEnter($subject: String!, $tenantId: String!) {\n  authenticate {\n    enter(subject: $subject, tenantId: $tenantId) {\n      success\n      accessToken\n      refreshToken\n      expiresIn\n      tokenType\n      identityContext {\n        zone\n        tenant\n        subject {\n          accountId\n          userId\n          username\n          email\n          displayName\n        }\n        groups\n      }\n      error\n    }\n  }\n}"): (typeof documents)["mutation AuthenticateEnter($subject: String!, $tenantId: String!) {\n  authenticate {\n    enter(subject: $subject, tenantId: $tenantId) {\n      success\n      accessToken\n      refreshToken\n      expiresIn\n      tokenType\n      identityContext {\n        zone\n        tenant\n        subject {\n          accountId\n          userId\n          username\n          email\n          displayName\n        }\n        groups\n      }\n      error\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation AuthenticateLogin($username: String!, $password: String!, $tenant: String) {\n  authenticate {\n    login(username: $username, password: $password, tenant: $tenant) {\n      success\n      subject\n      tenants {\n        id\n        name\n        displayName\n        zoneId\n        type\n        description\n        isActive\n      }\n      accessToken\n      refreshToken\n      expiresIn\n      tokenType\n      identityContext {\n        zone\n        tenant\n        subject {\n          accountId\n          userId\n          username\n          email\n          displayName\n        }\n        groups\n      }\n      error\n    }\n  }\n}"): (typeof documents)["mutation AuthenticateLogin($username: String!, $password: String!, $tenant: String) {\n  authenticate {\n    login(username: $username, password: $password, tenant: $tenant) {\n      success\n      subject\n      tenants {\n        id\n        name\n        displayName\n        zoneId\n        type\n        description\n        isActive\n      }\n      accessToken\n      refreshToken\n      expiresIn\n      tokenType\n      identityContext {\n        zone\n        tenant\n        subject {\n          accountId\n          userId\n          username\n          email\n          displayName\n        }\n        groups\n      }\n      error\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query CheckEmailAvailabilityInRegistration($email: String!) {\n  registration {\n    email(address: $email) {\n      available\n      reason\n    }\n  }\n}"): (typeof documents)["query CheckEmailAvailabilityInRegistration($email: String!) {\n  registration {\n    email(address: $email) {\n      available\n      reason\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation RegisterInRegistration($input: RegisterInput!) {\n  registration {\n    register(input: $input) {\n      success\n      accountId\n      message\n      requiresVerification\n      appliedTenant\n    }\n  }\n}"): (typeof documents)["mutation RegisterInRegistration($input: RegisterInput!) {\n  registration {\n    register(input: $input) {\n      success\n      accountId\n      message\n      requiresVerification\n      appliedTenant\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation VerifyEmailInRegistration($token: String!) {\n  registration {\n    verifyEmail(token: $token) {\n      success\n      message\n      accountId\n      tenantStatus {\n        hasTenants\n        requiresTenantSelection\n        pendingApproval\n        activeTenants\n      }\n    }\n  }\n}"): (typeof documents)["mutation VerifyEmailInRegistration($token: String!) {\n  registration {\n    verifyEmail(token: $token) {\n      success\n      message\n      accountId\n      tenantStatus {\n        hasTenants\n        requiresTenantSelection\n        pendingApproval\n        activeTenants\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation ResendVerificationEmailInRegistration($email: String!) {\n  registration {\n    resendVerificationEmail(email: $email) {\n      success\n      message\n    }\n  }\n}"): (typeof documents)["mutation ResendVerificationEmailInRegistration($email: String!) {\n  registration {\n    resendVerificationEmail(email: $email) {\n      success\n      message\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;