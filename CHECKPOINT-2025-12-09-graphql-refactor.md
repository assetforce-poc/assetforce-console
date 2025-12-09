# Checkpoint: GraphQL Refactor & Infrastructure Scripts

**Date**: 2025-12-09
**Session**: GraphQL Loader Migration + Infrastructure Automation
**Branch**: `main`
**Status**: ✅ Completed

---

## 会话摘要

本次会话完成了 GraphQL 导入方式的重大重构，从 `graphql-tag/loader` 迁移到 `@graphql-codegen/cli`，解决了 Next.js 15 Turbopack + ESM 兼容性问题。同时创建了统一的基础设施脚本系统，简化开发、构建、测试流程。

---

## 完成任务

### 1. GraphQL 重构 ✅

**问题**:
- `graphql-tag/loader` 输出 CommonJS 模块
- 与项目 ESM 配置 (`"type": "module"`) 冲突
- Turbopack production build 失败

**解决方案**: 迁移到 GraphQL Codegen

**变更**:
```typescript
// 之前（不兼容）
import REGISTER_MUTATION from '../register.gql';

// 之后（ESM 兼容）
import { RegisterInRegistrationDocument as REGISTER_MUTATION } from '../../generated/graphql';
```

**影响文件**:
- ✅ `register/hooks/useRegister.ts`
- ✅ `register/hooks/useEmailAvailability.ts`
- ✅ `verify-email/hooks/useVerifyEmail.ts`
- ✅ `register/index.ts` (公开 API)
- ✅ `__tests__/**/*.test.tsx` (测试文件)

**验证**:
- TypeScript 类型检查: ✅ PASS
- Production Build: ✅ PASS (13.89s)
- Unit Tests: ✅ PASS
- E2E Tests: ✅ PASS

### 2. 统一脚本系统 ✅

**位置**: `assetforce-infra/scripts/`

**创建脚本**:
1. **dev.sh** - 启动开发环境
   ```bash
   ./scripts/dev.sh [frontend|backend|all]
   ```
   - 自动启动 Docker Compose 服务
   - 支持部分启动（仅前端/仅后端）

2. **build.sh** - 构建生产镜像
   ```bash
   ./scripts/build.sh [frontend|backend|all]
   ```
   - 使用 `--no-cache` 确保干净构建
   - 支持 GITHUB_PACKAGES_TOKEN

3. **codegen.sh** - GraphQL 代码生成
   ```bash
   ./scripts/codegen.sh
   ```
   - 自动检查并启动 AAC 服务
   - 等待 GraphQL 端点就绪
   - 运行 `yarn codegen`

4. **test.sh** - 测试运行
   ```bash
   ./scripts/test.sh [unit|e2e|all]
   ```
   - 前端单元测试 (Jest)
   - 后端单元测试 (Maven)
   - E2E 测试 (Playwright)

5. **README.md** - 完整使用文档

**配置**:
- 支持 `.env` 文件加载环境变量
- 统一错误处理（`set -e`）
- 清晰的进度提示（emoji + 描述）

### 3. Commits 清理 ✅

**Squash 操作**:
```
# 之前：6 个零散 commits
1a73bee chore(graphql): rename graphql-codegen-config → graphql-config...
685d643 fix(graphql): correct .gql imports and add codegen script
4547ef7 chore(turbo): add codegen task definition
3c308dc fix(authentication): add .gql type declarations...
20ecf1b refactor(graphql): switch from graphql-tag/loader to codegen
b5f125d docs: add GraphQL loader alternatives backlog

# 之后：1 个清晰 commit
c73eb6c refactor(graphql): switch to codegen from graphql-tag/loader
```

**Commit Message**:
- ✅ 包含 BREAKING CHANGE 说明
- ✅ 迁移路径清晰
- ✅ 问题描述和解决方案
- ✅ 验证结果（build 时间）

### 4. Week 3 任务验证 ✅

**任务清单**:
- ✅ 删除旧 GraphQL 文件（graphql.ts → .gql + codegen）
- ✅ 删除旧 Backend API（迁移到 namespace API，Week 2 完成）
- ✅ 自动化测试（单元测试 + E2E + 统一脚本）
- ✅ 文档更新（技术文档 + 基础设施文档）

**文档产出**:
- `docs/backlog/graphql-loader-alternatives.md` - Loader 替代方案
- `docs/backlog/week3-completion-checklist.md` - 任务完成清单
- `assetforce-infra/scripts/README.md` - 脚本使用指南
- `packages/graphql-config/README.md` - GraphQL 配置文档

---

## 技术决策

### 决策 1: Codegen vs Loader

**选择**: GraphQL Codegen（方案 A）

**理由**:
1. ✅ 完全 ESM 兼容
2. ✅ 与 Turbopack 完美配合
3. ✅ 更好的类型安全
4. ✅ 无需额外 loader 配置
5. ✅ 构建产物更小（tree-shakeable）

**权衡**:
- ❌ 需要手动运行 codegen（已通过脚本自动化）
- ❌ 导入路径较长（可接受）

**备选方案**: 保留在 `docs/backlog/graphql-loader-alternatives.md`

### 决策 2: 脚本位置

**选择**: `assetforce-infra/scripts/`

**理由**:
- 统一管理前后端操作
- 跨项目复用
- Docker Compose 配置集中

---

## 关键文件

### Console Repo

**GraphQL 配置**:
```
packages/graphql-config/
├── package.json           # 包配置（依赖 codegen）
├── README.md              # 使用文档
└── src/
    ├── index.ts           # 主入口
    ├── codegen.ts         # Codegen 工厂函数
    └── turbopack.ts       # Turbopack 配置（已移除）
```

**生成文件**:
```
packages/feature/authentication/
├── codegen.ts             # Codegen 配置
└── generated/
    ├── index.ts           # 导出入口
    ├── gql.ts             # gql 函数
    └── graphql.ts         # Document 和类型
```

**源文件**:
```
packages/feature/authentication/register/
├── checkEmailAvailability.gql
├── register.gql
└── verifyEmail.gql
```

### Infra Repo

**脚本系统**:
```
assetforce-infra/scripts/
├── README.md              # 使用文档
├── dev.sh                 # 开发环境启动
├── build.sh               # 生产构建
├── codegen.sh             # GraphQL 代码生成
└── test.sh                # 测试运行
```

---

## Git 状态

### Console Repo
**Branch**: `main`
**Ahead of origin**: 15 commits
**Working tree**: clean

**Recent commits**:
```
8925797 docs: add Week 3 completion checklist
51ddcd4 style: apply prettier formatting
c73eb6c refactor(graphql): switch to codegen from graphql-tag/loader
4eaa14a fix(authentication): sync frontend types with backend namespace API
b484538 docs: update test users
```

### Infra Repo
**Branch**: `main`
**Recent commits**:
```
467a989 feat(scripts): add unified dev/build/test/codegen scripts
5cec1c9 feat(tests): add AAC containerized test environment
e9be779 docs: update test users with multi-tenant information
```

---

## 环境信息

**Next.js**: 16.0.7 (Turbopack)
**Node**: 20-alpine
**Package Manager**: Yarn 1.22.22
**GraphQL Codegen**: ~5.0.0
**GraphQL Client Preset**: ~4.0.0

**Services**:
- AAC GraphQL: http://localhost:8081/graphql
- IMC GraphQL: http://localhost:8082/graphql
- Customer Portal: http://localhost:3000
- Admin Console: http://localhost:3001
- Keycloak: http://localhost:8080

---

## 测试结果

### TypeScript 类型检查
```bash
yarn workspace @assetforce/authentication type-check
✅ PASS - Done in 1.73s
```

### Production Build
```bash
yarn workspace @assetforce/customer-portal build
✅ PASS - Done in 13.89s
```

**输出**:
```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/auth/[...auth]
├ ƒ /api/graphql
├ ○ /auth/login
├ ○ /auth/register
├ ○ /auth/registration-success
└ ○ /auth/verify-email
```

### 单元测试
```bash
yarn workspace @assetforce/authentication test
✅ PASS - All tests passed
```

### E2E 测试
```bash
yarn e2e:auth
✅ PASS - Registration flow complete
```

---

## 后续工作

### 短期（本周）
1. **Push commits** - 推送到远程仓库
   ```bash
   git push origin main  # Console repo
   cd ../assetforce-infra && git push origin main  # Infra repo
   ```

2. **验证 Docker 环境** - 测试新脚本
   ```bash
   cd assetforce-infra
   ./scripts/dev.sh all
   ./scripts/codegen.sh
   ./scripts/test.sh all
   ```

3. **团队培训** - 新脚本使用说明
   - 分享 `assetforce-infra/scripts/README.md`
   - 演示开发流程

### 中期（下周）
1. **Week 4 任务** - 查看 roadmap
2. **性能优化** - 分析 production bundle
3. **CI/CD 集成** - 使用新脚本

### 长期
1. **Monitoring** - 生产环境监控
2. **Performance** - 性能基准测试
3. **Documentation** - API 文档生成

---

## 知识沉淀

### 学到的经验

1. **Turbopack Loader 限制**
   - 只支持 webpack loader API 的子集
   - CommonJS 输出与 ESM 项目不兼容
   - 官方建议使用 codegen

2. **GraphQL Codegen 优势**
   - 生成准确的 TypeScript 类型
   - 完全 tree-shakeable
   - 不依赖构建时 loader

3. **脚本自动化最佳实践**
   - 统一错误处理 (`set -e`)
   - 清晰的进度提示
   - 环境变量集中管理
   - 支持部分执行（frontend/backend/all）

### 避坑指南

1. **Rebase 冲突**
   - 先 `git stash` 保存本地更改
   - 解决冲突后 `git rm` 删除文件
   - `git rebase --continue` 继续

2. **Docker Compose**
   - 确保 GITHUB_PACKAGES_TOKEN 设置
   - 使用 `--no-cache` 避免缓存问题
   - 等待服务就绪再执行操作

3. **Codegen**
   - 确保后端服务运行
   - 检查 GraphQL 端点可访问
   - 生成的文件添加到 `.gitignore`（如不需要）

---

## 参考资源

### 文档
- [Next.js Turbopack](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
- [Turbopack GraphQL Issue #72573](https://github.com/vercel/next.js/issues/72573)

### 内部文档
- `docs/backlog/graphql-loader-alternatives.md`
- `docs/backlog/week3-completion-checklist.md`
- `assetforce-infra/scripts/README.md`
- `packages/graphql-config/README.md`

---

## Checkpoint 元数据

**Created**: 2025-12-09T10:45:00+09:00
**Session Duration**: ~2 hours
**Commits**: 4 (Console) + 1 (Infra)
**Files Changed**: 40+
**Lines Added**: 3,000+
**Lines Removed**: 200+

**Next Checkpoint**: After Week 4 completion

---

**Contextor**: Checkpoint 快照已保存。会话上下文已完整记录。
