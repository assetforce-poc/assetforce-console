import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:8081/graphql', // AAC GraphQL endpoint
  documents: ['**/*.gql', '**/*.graphql'],
  generates: {
    // login 子功能
    './login/graphql/generated/': {
      documents: ['login/graphql/*.gql'],
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
        gqlTagName: 'gql',
      },
      config: {
        useTypeImports: true,
        skipTypename: false,
        enumsAsTypes: true,
        documentMode: 'documentNode',
      },
    },
    // session 子功能
    './session/graphql/generated/': {
      documents: ['session/graphql/*.gql'],
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
        gqlTagName: 'gql',
      },
      config: {
        useTypeImports: true,
        skipTypename: false,
        enumsAsTypes: true,
        documentMode: 'documentNode',
      },
    },
    // mfa 子功能 (待实施)
    // './mfa/graphql/generated/': {
    //   documents: ['mfa/graphql/*.gql'],
    //   preset: 'client',
    //   presetConfig: {
    //     fragmentMasking: false,
    //     gqlTagName: 'gql',
    //   },
    //   config: {
    //     useTypeImports: true,
    //     skipTypename: false,
    //     enumsAsTypes: true,
    //     documentMode: 'documentNode',
    //   },
    // },
  },
  ignoreNoDocuments: true,
};

export default config;
