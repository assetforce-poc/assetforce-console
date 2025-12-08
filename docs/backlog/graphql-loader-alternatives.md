# GraphQL Loader Alternatives - Backlog

**Status**: Documented Alternative
**Date**: 2025-12-09
**Context**: v2.0.0.20251212-gql-typeDefs refactoring

## Current Implementation (方案 A)

使用 **GraphQL Codegen** 生成 TypeScript 类型和 Document 对象。

### 工作流程
1. 编写 `.gql` 文件（GraphQL 查询/变更）
2. 运行 `yarn codegen` 生成 `generated/graphql.ts`
3. 从 `generated/graphql` 导入 Document

```typescript
// 示例
import { RegisterInRegistrationDocument as REGISTER_MUTATION } from '../generated/graphql';
```

### 优点
- ✅ 完全 ESM 兼容
- ✅ 与 Turbopack 完美配合
- ✅ 更好的类型安全（生成准确的 TypeScript 类型）
- ✅ 无需额外 loader 配置
- ✅ 构建产物更小（tree-shakeable）

### 缺点
- ❌ 需要手动运行 codegen（或配置 watch）
- ❌ 导入路径较长
- ❌ Git diff 包含生成的文件

---

## 备选方案 B（graphql-tag/loader）

使用 **webpack loader** 直接导入 `.gql` 文件。

### 为何未采用

在 Next.js 15 + Turbopack 环境下遇到以下问题：

1. **CommonJS/ESM 冲突**
   - `graphql-tag/loader` 输出 CommonJS 模块
   - 项目配置为 ESM (`"type": "module"`)
   - Turbopack 构建时报错：`Specified module format (EcmaScript Modules) is not matching`

2. **Turbopack 限制**
   - Turbopack 只实现了 webpack loader API 的核心子集
   - 对某些 loader 支持不完整
   - 参考：[Next.js Issue #72573](https://github.com/vercel/next.js/issues/72573)

### 如何切换回此方案

如果未来需要使用 loader（例如 Turbopack 改进支持），操作步骤：

#### 1. 恢复 Turbopack 配置

```typescript
// packages/graphql-config/src/turbopack.ts
export function createTurbopackRules(options: TurbopackGraphQLOptions = {}) {
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

  return { rules, resolveExtensions };
}

// apps/*/next.config.ts
import { createTurbopackRules } from '@assetforce/graphql-config/turbopack';

const nextConfig: NextConfig = {
  // ...
  turbopack: createTurbopackRules(),
};
```

#### 2. 添加类型声明

```typescript
// packages/feature/authentication/graphql.d.ts
declare module '*.gql' {
  import type { DocumentNode } from 'graphql';
  const value: DocumentNode;
  export default value;
}

declare module '*.graphql' {
  import type { DocumentNode } from 'graphql';
  const value: DocumentNode;
  export default value;
}
```

#### 3. 修改导入方式

```typescript
// 从
import { RegisterInRegistrationDocument as REGISTER_MUTATION } from '../generated/graphql';

// 改为
import REGISTER_MUTATION from '../register.gql';
```

#### 4. 可选：切换回 webpack

如果 Turbopack 依然不兼容，可在 `next.config.ts` 中禁用 Turbopack：

```bash
# 开发时使用 webpack
yarn next dev  # 而不是 --turbopack
```

或在 `package.json` 中移除 `--turbopack` 参数。

---

## 相关资源

- [Next.js Turbopack Configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
- [graphql-tag Package](https://www.npmjs.com/package/graphql-tag)
- [Turbopack GraphQL Issue #72573](https://github.com/vercel/next.js/issues/72573)
- [How to resolve .graphql files in Next.js using Turbopack](https://irzu.org/research/javascript-how-to-resolve-graphql-files-in-next-js-using-turbopack/)

---

## 决策记录

| Date | Decision | Reason |
|------|----------|--------|
| 2025-12-09 | 采用方案 A (Codegen) | Turbopack + ESM 兼容性问题，codegen 提供更好的类型安全 |
| - | 保留方案 B 文档 | 作为备选方案，等待 Turbopack 改进 |

---

**维护者**: 参考此文档了解两种方案的权衡，以便在未来技术栈变化时做出决策。
