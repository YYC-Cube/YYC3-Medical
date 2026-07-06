# YYC³-Med 开发者指南

> 当前版本对应仓库状态：2026-07-04 阶段六收口
> 权威源：`package.json` + `AGENTS.md` + 本文件。如三者冲突，以 `package.json` 为准。

## 技术栈现状

| 层 | 技术 | 版本 |
|----|------|------|
| 框架 | Next.js (App Router) | 16.x（package.json 声明 `^16.2.6`） |
| 运行时 | React | 18.3 |
| 语言 | TypeScript (strict) | 5.x |
| 样式 | Tailwind CSS + shadcn/ui + Radix UI | 3.4 |
| 状态 | Zustand（全局）+ React Context（cross-tree）+ React Hook Form（表单） | — |
| 图表 | Recharts、D3.js | — |
| 3D | Three.js + React Three Fiber | — |
| 字体 | GeistSans（自托管，无需联网） | — |
| 部署 | GitHub Pages（静态导出 `output: 'export'`） | — |
| 包管理器 | pnpm | 9.x |
| 测试 | Jest + Testing Library + jsdom | — |

> ⚠️ 历史版本（v1.0.0）曾基于 Next 14 + npm + 在线 Google Fonts，已于阶段二/三迁移至上述栈。

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

- ❌ 无 API Routes
- ❌ 无 Middleware
- ❌ 无 Server Actions
- ❌ 无 ISR / dynamic server rendering
- ✅ 所有数据来自构建期 SSG 或客户端 fetch 外部 API

## 环境变量

定义在 `lib/env.ts`：

- `DEEPSEEK_API_KEY` — DeepSeek AI key
- `DEEPSEEK_BASE_URL` — 默认 `https://api.deepseek.com`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_VERSION`
- `NEXT_PUBLIC_SHOW_PERFORMANCE_MONITOR=true` — 显示浮动性能监视器

## 本地开发

```bash
pnpm install            # 装依赖
pnpm dev                # dev server（Turbopack）
pnpm build              # 静态导出到 out/
pnpm type-check         # TypeScript strict 检查
pnpm lint               # ESLint
pnpm test               # Jest
pnpm test -- --coverage # 带覆盖率
```

构建完全离线可用（GeistSans 自托管）。

## 提交与 CI

- **Commit**: Conventional Commits（`feat:` / `fix:` / `docs:` / `refactor:` / `chore:` / `test:`），中英文均可
- **CI 门禁**（全部 workflow 统一 pnpm + Node 20）：
  - `ci.yml`：lint、type-check、format-check、build（hard gate）
  - `test.yml`：jest + coverage
  - `lint.yml`：独立 ESLint 检查
  - `audit.yml`：pnpm audit
  - `codeql.yml`、`njsscan.yml`：安全扫描
  - `deploy.yml`：main 分支推送触发 GitHub Pages 部署

## 项目结构

参见 `AGENTS.md` 的 "Repository Layout" 章节。该文件是与代码同步的权威源。

## 测试约定

- 测试位置：`__tests__/` 镜像源码结构（`__tests__/lib/`、`__tests__/hooks/`、`__tests__/store/`、`__tests__/components/`）
- 命名：`*.test.ts(x)`
- 运行：`pnpm test`（默认全量）或 `pnpm test -- <path>`
- 覆盖率：见 `jest.config.js` 注释（渐进式爬坡，目标 70%）
- 新代码须配套测试；新增 service / hook / util 至少需要 happy-path + 边界测试

## 引用与扩展阅读

- `AGENTS.md` — AI 代理工作指南（命令、约定、gotchas）
- `CONTRIBUTING.md` — 贡献流程
- `docs/phase-completion-plan.md` — 阶段路线图与门禁演进
- `docs/tech-debt/any-audit.md` — `any` 类型技术债清单
- `README.md` — 项目概览与徽章
- `SECURITY.md` — 漏洞披露流程
