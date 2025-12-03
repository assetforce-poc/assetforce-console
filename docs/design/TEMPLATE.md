# 设计文档模板指南

- **Version**: 1.0
- **Created**: 2025-12-03

---

## 概述

本目录包含两个模板：

| 模板                                               | 用途           | 文件名规范                  |
| -------------------------------------------------- | -------------- | --------------------------- |
| [module-template.md](#module-templatemd)           | 模块级概览     | `{module}/README.md`        |
| [subfunction-template.md](#subfunction-templatemd) | 子功能详细设计 | `{module}/{subfunction}.md` |

---

## 文档层级

```
docs/design/
├── README.md                    # 设计概览（全局）
├── TEMPLATE.md                  # 本文件（模板指南）
│
├── {module}/                    # 模块目录
│   ├── README.md                # 模块概览（使用 module-template）
│   ├── {subfunction-1}.md       # 子功能详细设计（使用 subfunction-template）
│   ├── {subfunction-2}.md
│   ├── fragments.md             # GraphQL Fragments（可选）
│   └── types.md                 # TypeScript 类型（可选）
│
└── authentication/              # 示例：认证模块
    ├── README.md
    ├── login.md
    ├── mfa.md
    └── ...
```

---

## 编写原则

### 1. 分层细化

| 层级   | 文档                      | 回答问题                       | 粒度   |
| ------ | ------------------------- | ------------------------------ | ------ |
| 概览   | design/README.md          | 有哪些模块？                   | 项目级 |
| 模块   | {module}/README.md        | 这个模块做什么？有哪些子功能？ | 模块级 |
| 子功能 | {module}/{subfunction}.md | 怎么实现？组件/API 长什么样？  | 代码级 |

### 2. 概览 vs 详细

| 概览文档应包含           | 详细文档应包含      |
| ------------------------ | ------------------- |
| 模块职责表               | 组件 Props 接口定义 |
| 子功能清单（表格）       | 详细数据流图        |
| GraphQL API 映射（表格） | GraphQL 代码块      |
| 实施优先级               | 使用示例代码        |
| 依赖关系                 | 待确认事项          |

### 3. 状态标记

| 状态   | 含义         |
| ------ | ------------ |
| Draft  | 初稿，待规整 |
| Review | 等待审核     |
| ✅     | 已完成       |

---

## module-template.md

```markdown
# @assetforce/{module-name} - 模块设计

- **Version**: 1.0
- **Created**: {YYYY-MM-DD}
- **Status**: Draft
- **Package**: `packages/feature/{module-name}`

---

## 1. 模块职责

**{模块名称}**负责{一句话描述}：

| 职责    | 说明   |
| ------- | ------ |
| {职责1} | {说明} |
| {职责2} | {说明} |

**不包含**：

- {不包含的内容1}（由 `@assetforce/{other-module}` 负责）

---

## 2. 子功能清单

| 子功能          | 目录               | 说明   | 详细设计                                   |
| --------------- | ------------------ | ------ | ------------------------------------------ |
| {subfunction-1} | `{subfunction-1}/` | {说明} | [{subfunction-1}.md](./{subfunction-1}.md) |
| {subfunction-2} | `{subfunction-2}/` | {说明} | [{subfunction-2}.md](./{subfunction-2}.md) |

---

## 3. GraphQL API 映射

### 3.1 Mutations

| Operation        | 子功能        | 说明   |
| ---------------- | ------------- | ------ |
| `{mutationName}` | {subfunction} | {说明} |

### 3.2 Queries

| Operation     | 子功能        | 说明   |
| ------------- | ------------- | ------ |
| `{queryName}` | {subfunction} | {说明} |

---

## 4. 实施优先级

| Phase | 子功能        | 目标   | 优先级 |
| ----- | ------------- | ------ | ------ |
| 1     | {subfunction} | {目标} | P0     |
| 2     | {subfunction} | {目标} | P1     |

---

## 5. 依赖关系

\`\`\`
@assetforce/{module-name}
│
├── @assetforce/common
├── @assetforce/material
└── {Backend} (GraphQL API)
\`\`\`

---

## 6. 设计文档路线图

| 文档               | 内容      | 状态  |
| ------------------ | --------- | ----- |
| README.md          | 模块概览  | ✅    |
| {subfunction-1}.md | {子功能1} | Draft |
| {subfunction-2}.md | {子功能2} | Draft |

---

## 附录: 相关文档

| 文档     | 路径                             |
| -------- | -------------------------------- |
| 需求文档 | `requirements/{requirement}.md`  |
| 后端架构 | `assetforce-docs/platform/...`   |
| 编码规范 | `standards/coding-guidelines.md` |
```

---

## subfunction-template.md

```markdown
# {subfunction-name} - {子功能名称}详细设计

- **Status**: Draft
- **Parent**: [README.md](./README.md)

---

## 1. 功能清单

| 功能    | 组件        | GraphQL                      | 优先级 |
| ------- | ----------- | ---------------------------- | ------ |
| {功能1} | {Component} | `{operation}` mutation/query | P0     |
| {功能2} | {Component} | `{operation}` mutation/query | P1     |

---

## 2. 数据流

\`\`\`
{用户操作}
↓
{Component} → {hook} → {GraphQL operation} → {Backend}
↓
┌───────┴───────┐
│ │
成功 失败
│ │
↓ ↓
{成功处理} {失败处理}
\`\`\`

---

## 3. 组件设计

### 3.1 {ComponentName}

\`\`\`typescript
interface {ComponentName}Props {
// 必需属性
{prop1}: {type};

// 回调
onSuccess: ({result}: {ResultType}) => void;
onError?: (error: {ErrorType}) => void;

// 可选配置
{optionalProp}?: {type};
}
\`\`\`

---

## 4. Hooks

### 4.1 use{HookName}

\`\`\`typescript
function use{HookName}(): {
{action}: ({input}: {InputType}) => Promise<{ResultType}>;
loading: boolean;
error: {ErrorType} | null;
}
\`\`\`

---

## 5. GraphQL

### 5.1 {operationName}.gql

\`\`\`graphql
mutation {operationName}($input: {InputType}!) {
{operationName}(input: $input) {
{field1}
{field2}
}
}
\`\`\`

---

## 6. 待确认事项

- [ ] {待确认问题1}
- [ ] {待确认问题2}
```

---

## 使用示例

创建新模块 `@assetforce/user`：

```bash
# 1. 创建模块目录
mkdir -p docs/design/user

# 2. 复制模板并重命名
# 使用 module-template 创建 README.md
# 使用 subfunction-template 创建各子功能文件

# 3. 填写内容
# - 替换所有 {placeholder}
# - 删除不需要的部分
# - 添加模块特有内容
```
