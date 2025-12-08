import type { NextConfig } from 'next';

/**
 * Options for configuring Turbopack GraphQL loader
 */
export interface TurbopackGraphQLOptions {
  /**
   * File extensions to process (defaults to ['.graphql', '.gql'])
   */
  extensions?: string[];
  /**
   * Additional resolve extensions (defaults to include .graphql and .gql)
   */
  resolveExtensions?: string[];
}

/**
 * Creates Turbopack rules for loading GraphQL files via graphql-tag/loader
 *
 * @example
 * ```typescript
 * // next.config.ts
 * import { createTurbopackRules } from '@assetforce/graphql-config/turbopack';
 *
 * const nextConfig: NextConfig = {
 *   turbopack: createTurbopackRules(),
 * };
 * ```
 *
 * @param options - Configuration options
 * @returns Turbopack configuration object
 */
export function createTurbopackRules(options: TurbopackGraphQLOptions = {}): NonNullable<NextConfig['turbopack']> {
  const {
    extensions = ['.graphql', '.gql'],
    resolveExtensions = ['.graphql', '.gql', '.tsx', '.ts', '.jsx', '.js', '.json'],
  } = options;

  const rules: Record<string, any> = {};

  for (const ext of extensions) {
    rules[`*${ext}`] = {
      loaders: ['graphql-tag/loader'],
      as: '*.js',
    };
  }

  return {
    rules,
    resolveExtensions,
  };
}
