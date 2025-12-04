import type { CodegenConfig } from '@graphql-codegen/cli';

// 共享的 preset 配置
const SHARED_PRESET_CONFIG = {
  fragmentMasking: false,
  gqlTagName: 'gql',
} as const;

// 共享的 codegen 配置
const SHARED_CONFIG = {
  useTypeImports: true,
  skipTypename: false,
  enumsAsTypes: true,
  documentMode: 'documentNode',
} as const;

// 创建子功能配置
const createSubfunctionConfig = (subfunctionPath: string) => ({
  documents: [`${subfunctionPath}/graphql/*.gql`],
  preset: 'client' as const,
  presetConfig: SHARED_PRESET_CONFIG,
  config: SHARED_CONFIG,
});

// 子功能列表（根据实际目录结构自动生成配置）
const SUBFUNCTIONS = ['login', 'session'];

// 自动生成 generates 配置
const generates = Object.fromEntries(
  SUBFUNCTIONS.map((name) => [`./${name}/graphql/generated/`, createSubfunctionConfig(name)])
);

const config: CodegenConfig = {
  schema: process.env.AAC_GRAPHQL_URL || 'http://localhost:8081/graphql',
  documents: ['**/*.gql', '**/*.graphql'],
  generates,
  ignoreNoDocuments: true,
};

export default config;
