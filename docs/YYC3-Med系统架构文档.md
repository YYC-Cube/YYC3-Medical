# YYC³-Med 系统架构

> 本文档解释仓库的物理与逻辑架构，明确"静态导出"的边界，以及与未来后端的对接点。
>
> 最近更新：2026-07-10（对齐终极审核状态）

## 目录

- [物理架构](#物理架构)
- [关键约束：静态导出](#关键约束静态导出outputexport)
- [数据流](#数据流当前)
- [医疗级设计系统架构](#医疗级设计系统架构)
- [国际化架构](#国际化架构)
- [状态管理架构](#状态管理架构)
- [未来后端的接口契约](#未来后端的接口契约)
- [模块组织](#模块组织)
- [部署管线](#部署管线)
- [已知限制](#已知限制)

---

## 物理架构

```
+--------------------------------------------------------------------+
|                       开发期 (Source Code)                          |
|  +----------+  +-----------+  +---------+  +---------+  +--------+ |
|  |  app/    |  |components/|  | hooks/  |  |services/|  | store/ | |
|  | (112     |  | (441 UI)  |  | (18)    |  | (30)    |  | (2)    | |
|  |  routes) |  |           |  |         |  |         |  |        | |
|  +----+-----+  +-----+-----+  +----+----+  +----+----+  +---+----+ |
|       |              |             |            |            |      |
|       +------+-------+-----+-------+-----+------+            |      |
|              |               |           |                   |      |
|              v               v           v                   |      |
|         +-----------+   +----------+  +------+               |      |
|         | contexts/ |   |  lib/    |  |types/|               |      |
|         | (5 ctx)   |   | utils/   |  |      |               |      |
|         +-----------+   | i18n/    |  +------+               |      |
|                         | api/     |                         |      |
|                         +----+-----+                         |      |
|                              |                               |      |
+------------------------------|-------------------------------+-------+
                               |
                               v
                      +-----------------+
                      |  pnpm build     |
                      |  (Turbopack)    |
                      |  SSG + static   |
                      +--------+--------+
                               |
                               v
                      +-----------------+
                      |   out/          |
                      |   static HTML   |
                      |   + JS bundles  |
                      |   + assets      |
                      +--------+--------+
                               |
                               v
                      +-----------------+
                      | GitHub Pages    |
                      | medical.yyc3.vip|
                      | (HTTPS only)    |
                      +-----------------+
```

### 项目指标（2026-07-06）

| 指标          | 数值                  |
| ------------- | --------------------- |
| 路由数        | 112 个 `page.tsx`     |
| 组件数        | 441 个 `.tsx`         |
| 自定义 Hooks  | 18                    |
| 业务服务      | 30（当前 mock 数据）  |
| Zustand Store | 2                     |
| React Context | 5                     |
| 测试          | 311 个用例，16 个套件 |
| 代码行数      | ~121,000 行 TS/TSX    |

---

## 关键约束：静态导出（`output: 'export'`）

- **构建期生成所有 HTML**：所有路由在 `next build` 时 prerender
- **运行时零服务端**：
  - ❌ 没有 Node.js server process
  - ❌ 不能用 `cookies()`、`headers()`、`response.cookies.set()` 等服务端 API
  - ❌ 不能定义 `app/api/*/route.ts`
  - ❌ 不能写 `middleware.ts`
  - ❌ 不能使用 Server Actions（`"use server"`）
  - ❌ 不能使用 ISR / `revalidate`
- **动态数据靠客户端 fetch**：组件挂载后通过 `useEffect` + `fetch()` 调外部 API

---

## 数据流（当前）

```
+----------------+        +---------------------+
|  Browser       |        |  GitHub Pages       |
|  (client)      |        |  (static hosting)   |
|                |        |                     |
|  1. GET /      | -----> |  2. 返回 HTML+JS    |
|                | <----- |                     |
|                |        +---------------------+
|                |
|  3. hydrate    |
|  4. render     |
|  5. useEffect: |
|     fetch()    |--+------------------------------------+
|                |  | (optional, to external API)        |
|                |  |                                    v
|                |  |                      +----------------------+
|                |  |                      | External Backend     |
|                |  |                      | (未来的 / 各 module   |
|                |  |                      |  自行接入的 API)      |
|                |  |                      +----------------------+
|                |  |
|  6. localStorage/IndexedDB ( Zustand persist / 直接存)
|                |
+----------------+
```

---

## 医疗级设计系统架构

v1.1.0 引入了完整的医疗级配色系统，基于 CSS 变量 + Tailwind 扩展：

### 配色层

```
app/globals.css (CSS 变量定义)
  ├── :root (亮色模式)
  │   ├── --background, --foreground
  │   ├── --primary, --secondary, --muted, --accent
  │   ├── --card, --border, --input, --ring
  │   ├── --success, --warning, --info (语义令牌)
  │   └── --medical-gradient-soft
  │
  └── .dark (暗色模式)
      └── 深海军蓝 (222 47% 11%) — 永不纯黑
          ├── --background: 222 47% 11%
          ├── --card: 222 47% 14%
          └── --success, --warning, --info (暗色语义令牌)

tailwind.config.ts (Tailwind 映射)
  ├── colors.medical (50→900 梯度)
  ├── colors.success / warning / info → CSS 变量
  └── animations: breathe, heartbeat, fade-in, slide-up, scale-in, shimmer
```

### 设计原则

1. **永不使用纯黑色容器** — 所有暗色背景使用 `medical-900`（深海军蓝）
2. **语义优先** — 使用 `success` / `warning` / `info` / `destructive` 令牌
3. **一致性** — 通过 `cn()` 工具函数组合条件类名

---

## 国际化架构

支持 **4 种语言**：`zh-CN`（默认）、`en-US`、`ja-JP`、`ko-KR`

```
两套并行系统：

1. 自定义内联字典
   contexts/language-context.tsx (Language Provider)
      └── hooks/use-translation.ts (useTranslation hook)
           └── lib/i18n/dictionaries/*.json (4 locale)

2. next-intl 目录
   messages/{en,zh}.json (消息目录)
      └── lib/i18n/config.ts (locale 配置)

辅助：
   i18n/medical-terms.ts (医疗术语表)
   contexts/auto-translation-context.tsx (自动翻译)
      └── hooks/use-auto-translation.ts
```

---

## 状态管理架构

```
┌─────────────────────────────────────────────┐
│              React Context (5)               │
│  ┌─────────────┐  ┌────────────────────────┐│
│  │ Theme        │  │ Language               ││
│  │ (next-themes)│  │ (LanguageProvider)     ││
│  └─────────────┘  └────────────────────────┘│
│  ┌─────────────┐  ┌────────────────────────┐│
│  │ Loading     │  │ UserAvatar             ││
│  └─────────────┘  └────────────────────────┘│
│  ┌─────────────────────────────────────────┐│
│  │ AutoTranslation + AutomaticExecution    ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
                      │
                      v
┌─────────────────────────────────────────────┐
│           Zustand Stores (2)                 │
│  ┌─────────────┐  ┌────────────────────────┐│
│  │ useAuthStore│  │ useSettingsStore       ││
│  │ (persist)   │  │ (persist)              ││
│  └─────────────┘  └────────────────────────┘│
└─────────────────────────────────────────────┘
                      │
                      v
┌─────────────────────────────────────────────┐
│         Form State (React Hook Form + zod)  │
└─────────────────────────────────────────────┘
```

Provider 栈顺序（`app/layout.tsx`）：

```
Theme → Language → Loading → UserAvatar → AutoTranslation
     → AutomaticExecution → children + Toaster
```

---

## 未来后端的接口契约

仓库中保留以下"未来接入点"，当前均无运行时实现：

| 位置                              | 用途                              | 接入方式                                     |
| --------------------------------- | --------------------------------- | -------------------------------------------- |
| `lib/db.ts`                       | 数据库连接占位                    | 接入真实后端时改为 Prisma/Drizzle/SQL client |
| `lib/auth/jwt.ts`、`utils/jwt.ts` | JWT 工具                          | 仅客户端工具，服务端验证需在后端实现         |
| `prisma/schema.prisma`            | 数据库 schema（MySQL）            | 后端启动时 `prisma migrate`                  |
| `services/search.ts`              | Elasticsearch 客户端              | 后端搜索服务，前端不应直接连                 |
| `services/*-service.ts`           | 各业务服务（30 个）               | 当前为 mock 数据；接入后端时替换内部 fetch   |
| `components/RouteCheck.tsx` 等    | 包含 `// STATIC-EXPORT-NOTE` 注释 | 注释处替换为后端 API 调用                    |

---

## 模块组织

- **路由层** (`app/`)：Next.js App Router，按业务域分目录
  - `(auth)/` `(medical)/` 是路由组（不影响 URL）
  - 每个路由通常有一个 `page.tsx`（server component）+ 对应的 `*-client.tsx`（client component）
- **组件层** (`components/`)：按业务域分组
  - `ui/` 是 shadcn/ui 原语（不可与业务组件混用）
  - 其它子目录按业务模块分（`admin/`、`patients/`、`ai-diagnosis/` 等）
- **逻辑层**：
  - `hooks/` — 18 个自定义 hooks
  - `services/` — 30 个业务服务（当前为 mock）
  - `lib/` — 工具函数、API client、i18n
- **状态层**：
  - `store/` — Zustand 全局状态（2 个 store）
  - `contexts/` — React Context providers（5 个）

---

## 部署管线

```
git push origin main
       |
       v
GitHub Actions (.github/workflows/deploy.yml)
       |
       +--- pnpm install --frozen-lockfile
       +--- pnpm build
       +--- touch out/.nojekyll (禁用 Jekyll)
       +--- echo "medical.yyc3.vip" > out/CNAME
       +--- upload-pages-artifact
       |
       v
GitHub Pages deployment
       |
       v
https://medical.yyc3.vip (HTTPS enforced)
```

---

## 已知限制

1. **无 SSR**：所有页面静态，无 per-request 数据
2. **无 ISR**：内容更新需重新部署
3. **搜索靠客户端**：大语料场景性能受限于浏览器
4. **认证靠 localStorage**：`useAuthStore` 持久化到 `localStorage`，无服务端 session
5. **API mock**：30 个 service 全为前端 mock 数据；接入真实后端时需逐一替换
6. **i18n 双系统**：自定义字典 + next-intl 并行存在，未来需统一
