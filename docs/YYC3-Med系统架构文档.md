# YYC³-Med 系统架构

> 一图胜千言。本文档解释仓库的物理与逻辑架构，明确"静态导出"的边界，以及与未来后端的对接点。

## 物理架构（当前）

```
+--------------------------------------------------------------------+
|                       开发期 (Source Code)                          |
|  +----------+  +-----------+  +---------+  +---------+  +--------+ |
|  |  app/    |  |components/|  | hooks/  |  |services/|  | store/ | |
|  | (routes) |  | (446 UI)  |  | (19)    |  | (30)    |  | (4)    | |
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

## 关键约束：静态导出（`output: 'export'`）

- **构建期生成所有 HTML**：所有路由在 `next build` 时 prerender
- **运行时零服务端**：
  - ❌ 没有 Node.js server process
  - ❌ 不能用 `cookies()`、`headers()`、`response.cookies.set()` 等服务端 API
  - ❌ 不能定义 `app/api/*/route.ts`
  - ❌ 不能写 `middleware.ts`
- **动态数据靠客户端 fetch**：组件挂载后通过 `useEffect` + `fetch()` 调外部 API

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

## "未来后端"的接口契约

仓库中保留以下"未来接入点"，当前均无运行时实现：

| 位置 | 用途 | 接入方式 |
|------|------|---------|
| `lib/db.ts` | 数据库连接占位 | 接入真实后端时改为 Prisma/Drizzle/SQL client |
| `lib/auth/jwt.ts`、`utils/jwt.ts` | JWT 工具 | 仅客户端工具，服务端验证需在后端实现 |
| `prisma/schema.prisma` | 数据库 schema（MySQL） | 后端启动时 `prisma migrate` |
| `services/search.ts` | Elasticsearch 客户端 | 后端搜索服务，前端不应直接连 |
| `services/*-service.ts` | 各业务服务（30 个） | 当前为 mock 数据；接入后端时替换内部 fetch |
| `components/RouteCheck.tsx` 等 | 包含 `// STATIC-EXPORT-NOTE` 注释 | 注释处替换为后端 API 调用 |

## 模块组织

- **路由层** (`app/`)：Next.js App Router，按业务域分目录
  - `(auth)/` `(medical)/` 是路由组（不影响 URL）
  - 每个路由通常有一个 `page.tsx`（server component）+ 对应的 `*-client.tsx`（client component）
- **组件层** (`components/`)：按业务域分组
  - `ui/` 是 shadcn/ui 原语（不可与业务组件混用）
  - 其它子目录按业务模块分（`admin/`、`patients/`、`ai-diagnosis/` 等）
- **逻辑层**：
  - `hooks/` — 19 个自定义 hooks
  - `services/` — 30 个业务服务（当前为 mock）
  - `lib/` — 工具函数、API client、i18n
- **状态层**：
  - `store/` — Zustand 全局状态（4 个 store）
  - `contexts/` — React Context providers（5 个）

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

## 已知限制

1. **无 SSR**：所有页面静态，无 per-request 数据
2. **无 ISR**：内容更新需重新部署
3. **搜索靠客户端**：大语料场景性能受限于浏览器
4. **认证靠 localStorage**：`useAuthStore` 持久化到 `localStorage`，无服务端 session
5. **API mock**：30 个 service 全为前端 mock 数据；接入真实后端时需逐一替换
