/**
 * @assetforce/graphql-config
 *
 * Shared GraphQL configuration utilities for AssetForce projects
 *
 * - Codegen: GraphQL Code Generator configuration
 * - Turbopack: Next.js Turbopack loader for .gql files
 */

export { createCodegenConfig } from './codegen';
export type { CodegenConfig } from '@graphql-codegen/cli';

export { createTurbopackRules } from './turbopack';
export type { TurbopackGraphQLOptions } from './turbopack';
