# YYC³-Med 开发者指南

> 权威源：`package.json` + `AGENTS.md` + 本文件。如三者冲突，以 `package.json` 为准。
>
> 最近更新：2026-07-10（对齐终极审核状态）

## 目录

- [YYC³-Med 开发者指南](#yyc-med-开发者指南)
  - [目录](#目录)
  - [技术栈现状](#技术栈现状)
  - [架构边界（静态导出）](#架构边界静态导出)
  - [环境变量](#环境变量)
    - [演示模式（静态导出）](#演示模式静态导出)
  - [本地开发](#本地开发)
  - [质量门禁](#质量门禁)
  - [项目指标](#项目指标)
  - [项目结构](#项目结构)
  - [国际化（i18n）](#国际化i18n)
    - [两套并行系统](#两套并行系统)
    - [添加翻译](#添加翻译)
  - [医疗级设计系统](#医疗级设计系统)
    - [配色原则](#配色原则)
    - [可用令牌](#可用令牌)
    - [动画](#动画)
  - [测试约定](#测试约定)
  - [无障碍（a11y）](#无障碍a11y)
    - [关键规则](#关键规则)
  - [提交与 CI/CD](#提交与-cicd)
    - [提交规范](#提交规范)
    - [CI/CD 管线](#cicd-管线)
  - [引用与扩展阅读](#引用与扩展阅读)

---

## 技术栈现状

| 层       | 技术                                                                  | 版本                              |
| -------- | --------------------------------------------------------------------- | --------------------------------- |
| 框架     | Next.js (App Router)                                                  | `^16.2.6`                         |
| 运行时   | React                                                                 | `^18.3.1`                         |
| 语言     | TypeScript (strict)                                                   | `^5.8.3`                          |
| 样式     | Tailwind CSS + shadcn/ui + Radix UI                                   | 3.4                               |
| 状态     | Zustand（全局）+ React Context（cross-tree）+ React Hook Form（表单） | —                                 |
| 图表     | Recharts、D3.js                                                       | —                                 |
| 3D       | Three.js + React Three Fiber                                          | —                                 |
| 动画     | Framer Motion                                                         | —                                 |
| 字体     | GeistSans（自托管，无需联网）                                         | —                                 |
| 部署     | GitHub Pages（静态导出 `output: 'export'`）                           | —                                 |
| 包管理器 | pnpm                                                                  | `9.15.4`（`packageManager` 声明） |
| 测试     | Jest + Testing Library + jsdom                                        | —                                 |
| Node.js  | `>= 18.17.0`                                                          | CI 固定 Node 20                   |

> ⚠️ 历史版本（v1.0.0）曾基于 Next 14 + npm + 在线 Google Fonts，已于阶段二/三迁移至上述栈。

---

## 架构边界（静态导出）

```
+-------------------+      +-------------------+      +-------------------+
|  Dev / Source     | ---> |  next build       | ---> |  out/             |
|  app/, components |      |  (Turbopack)      |      |  (static HTML/JS) |
|  hooks, services  |      |  SSG + static     |      |       |           |
+-------------------+      +-------------------+      |       v           |
                                                      |  GitHub Pages     |
                                                      |  medical.yyc3.vip |
                                                      +-------------------+
```

**没有运行时后端**：

- ❌ 无 API Routes（`app/api/*/route.ts`）
- ❌ 无 Middleware（`middleware.ts`）
- ❌ 无 Server Actions
- ❌ 无 ISR / dynamic server rendering
- ❌ 不能在 render 中调用 `cookies()`、`headers()`
- ✅ 所有数据来自构建期 SSG 或客户端 fetch 外部 API

---

## 环境变量

定义在 `lib/env.ts`，参考 `.env.example`：

| 变量                                   | 用途                            |
| -------------------------------------- | ------------------------------- |
| `DEEPSEEK_API_KEY`                     | DeepSeek AI API 密钥            |
| `DEEPSEEK_BASE_URL`                    | 默认 `https://api.deepseek.com` |
| `NEXT_PUBLIC_APP_URL`                  | 应用公开 URL                    |
| `NEXT_PUBLIC_APP_VERSION`              | 应用版本号                      |
| `NEXT_PUBLIC_SHOW_PERFORMANCE_MONITOR` | 设为 `true` 显示浮动性能监视器  |

### 演示模式（静态导出）

| 变量                             | 用途                              |
| -------------------------------- | --------------------------------- |
| `NEXT_PUBLIC_DEMO_MODE`          | 设为 `true` 启用演示登录          |
| `NEXT_PUBLIC_DEMO_ADMIN_PWD`     | 演示管理员密码                    |
| `NEXT_PUBLIC_DEMO_DOCTOR_PWD`    | 演示医生密码                      |
| `NEXT_PUBLIC_DEMO_NURSE_PWD`     | 演示护士密码                      |

> 生产环境务必设 `NEXT_PUBLIC_DEMO_MODE=false` 并接入后端 `/auth/login`。

---

## 本地开发

```bash
pnpm install            # 装依赖（如遇 workspace 冲突：pnpm install --ignore-workspace）
pnpm dev                # dev server（Turbopack）
pnpm build              # 静态导出到 out/
pnpm type-check         # TypeScript strict 检查
pnpm lint               # ESLint
pnpm lint:fix           # ESLint --fix
pnpm format             # Prettier write
pnpm test               # Jest
pnpm test -- --coverage # 带覆盖率
pnpm test -- <pattern>  # 运行指定测试文件
```

构建完全离线可用（GeistSans 自托管，无在线字体依赖）。

---

## 质量门禁

提交前必须通过的 5 道门禁：

| 门禁     | 命令              | 要求                            |
| -------- | ----------------- | ------------------------------- |
| 类型检查 | `pnpm type-check` | 0 errors                        |
| Lint     | `pnpm lint`       | **0 errors, 0 warnings**        |
| 测试     | `pnpm test`       | 全部通过                        |
| 构建     | `pnpm build`      | 静态导出成功                    |
| 性能基线 | `node scripts/perf-baseline.mjs` | 评分 ≥ 85/100   |

CI 通过 GitHub Actions 在每次 push/PR 到 `main` 时运行上述门禁（见 [CI/CD](#提交与-cicd)）。

---

## 项目指标

> 以下数据为 2026-07-10 终极审核验证结果。

| 指标                         | 数值            |
| ---------------------------- | --------------- |
| 路由数（`page.tsx`）         | 114             |
| 组件数（`components/*.tsx`） | 441             |
| 自定义 Hooks                 | 18              |
| 业务服务（`services/`）      | 30              |
| Zustand 全局 Store           | 2               |
| React Context Provider       | 5               |
| 测试套件                     | 17              |
| 测试用例                     | 291（全部通过） |
| ESLint errors                | 0               |
| ESLint warnings              | 0               |
| TypeScript errors            | 0               |
| 最大 JS Chunk                | 223KB           |
| 超大 Chunk (>350KB)          | 0               |
| 性能基线评分                 | 92/100          |
| 代码行数（TS/TSX）           | ~121,000        |

---

## 项目结构

参见 `AGENTS.md` 的 "Repository Layout" 章节 — 该文件是与代码同步的权威源。

**关键目录**：

```
app/                  112 个路由（App Router）
components/           441 个组件（按功能域分组）
  ui/                 shadcn/ui 原语（Radix-based）
hooks/                18 个自定义 hooks
services/             30 个业务服务（当前 mock 数据）
store/                2 个 Zustand store（auth, settings）
contexts/             5 个 React Context providers
lib/                  工具函数、API client、i18n、env
types/                TS 类型定义
i18n/                 医疗术语 + 翻译
messages/             next-intl 消息目录（en, zh）
```

---

## 国际化（i18n）

支持 **4 种语言**：`zh-CN`（默认）、`en-US`、`ja-JP`、`ko-KR`。

### 两套并行系统

1. **自定义内联字典**：`contexts/language-context.tsx` + `hooks/use-translation.ts`
2. **next-intl 目录**：`messages/{en,zh}.json` + `lib/i18n/dictionaries/*.json`

### 添加翻译

```tsx
const { t } = useTranslation();
return <h1>{t('patients.title')}</h1>;
```

- 新增用户可见文案时，在 `lib/i18n/dictionaries/` 中添加所有 4 种语言的 key
- 医疗术语添加到 `i18n/medical-terms.ts`
- 默认 `<html lang="zh-CN">`（见 `app/layout.tsx`）

---

## 医疗级设计系统

v1.1.0 引入了完整的医疗级配色系统。

### 配色原则

- **永不使用纯黑色容器** — 暗色模式使用深海军蓝（`222 47% 11%`）
- 使用 `medical-*` 系列令牌替代 `gray-*` / `black` / `slate-*`

### 可用令牌

| 令牌                         | 用途                 |
| ---------------------------- | -------------------- |
| `medical-50` → `medical-900` | 主色蓝/深蓝梯度      |
| `success`                    | 语义成功（绿色）     |
| `warning`                    | 语义警告（琥珀色）   |
| `info`                       | 语义信息（蓝色）     |
| `primary`                    | 品牌主色（CSS 变量） |
| `destructive`                | 错误/危险操作        |

### 动画

`breathe`、`heartbeat`、`fade-in`、`slide-up`、`scale-in`、`shimmer` 可作为 Tailwind 动画工具类使用。

详见 `app/globals.css` 和 `tailwind.config.ts`。

---

## 测试约定

- **测试位置**：`__tests__/` 镜像源码结构（`__tests__/lib/`、`__tests__/hooks/`、`__tests__/store/`、`__tests__/components/`、`__tests__/services/`）
- **命名**：`*.test.ts(x)`
- **运行**：`pnpm test`（全量）或 `pnpm test -- <path>`
- **覆盖率**：见 `jest.config.js` 注释（渐进式爬坡，目标 70%）
- **新代码须配套测试**：新增 service / hook / util 至少需要 happy-path + 边界测试
- **测试库**：`@testing-library/react` + `@testing-library/user-event`
- **当前覆盖率**：statements 43.09%, branches 63.91%, functions 42.81%, lines 44.15%

---

## 无障碍（a11y）

项目遵循 WCAG 2.1 AA 标准。

### 关键规则

1. **可点击 `div` 必须包含键盘交互**：`role="button"` + `tabIndex={0}` + `onKeyDown(Enter/Space)`
   - 使用辅助函数：`import { clickableDivProps } from '@/lib/a11y'`
2. **`target="_blank"` 链接必须添加 `rel="noopener noreferrer"`**
3. **所有交互元素必须可通过键盘访问**
4. **图片必须有 `alt` 描述**
5. **表单字段必须有关联的 `label`**

ESLint 通过 `jsx-a11y/*` 规则集自动检查上述规则。

---

## 提交与 CI/CD

### 提交规范

Conventional Commits（`feat:` / `fix:` / `docs:` / `refactor:` / `chore:` / `test:`），中英文均可。

Pre-commit hook（`.husky/pre-commit`）运行 `lint-staged` → `eslint --fix` + `prettier --write`。

### CI/CD 管线

全部 workflow 统一 **pnpm + Node 20**：

| Workflow      | 触发            | 说明                                                   |
| ------------- | --------------- | ------------------------------------------------------ |
| `ci.yml`      | push/PR to main | lint、type-check、format-check、**build（hard gate）** |
| `test.yml`    | push/PR to main | jest + coverage                                        |
| `lint.yml`    | push/PR to main | 独立 ESLint 检查                                       |
| `audit.yml`   | push/PR to main | pnpm audit（non-blocking）                             |
| `codeql.yml`  | 安全扫描        | GitHub CodeQL                                          |
| `njsscan.yml` | 安全扫描        | njsscan                                                |
| `deploy.yml`  | push to main    | GitHub Pages 部署                                      |

---

## 引用与扩展阅读

- [`AGENTS.md`](../AGENTS.md) — AI 代理工作指南（命令、约定、gotchas）
- [`CONTRIBUTING.md`](../CONTRIBUTING.md) — 贡献流程与代码规范
- [`CHANGELOG.md`](../CHANGELOG.md) — 版本变更记录
- [`README.md`](../README.md) — 项目概览与徽章
- [`SECURITY.md`](../SECURITY.md) — 漏洞披露流程
- [`.env.example`](../.env.example) — 环境变量配置模板
- [`docs/YYC3-Med系统架构文档.md`](YYC3-Med系统架构文档.md) — 系统架构详解
- [`docs/naming-conventions.md`](naming-conventions.md) — 命名规范
- [`docs/后端技术选型分析与实施指导建议.md`](后端技术选型分析与实施指导建议.md) — 后端技术选型
- [`docs/项目深度分析与提升规划报告.md`](项目深度分析与提升规划报告.md) — 项目深度分析与规划
