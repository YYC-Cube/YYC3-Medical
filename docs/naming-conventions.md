# YYC³-Med 命名规范

> 与现实代码对齐的命名约定。本文件取代历史版本（v1.0.0 曾规定组件 PascalCase，但实际仓库已广泛采用 kebab-case）。

## 文件命名

| 类型 | 约定 | 示例 |
|------|------|------|
| 组件文件 | **kebab-case** `.tsx` | `patient-card.tsx`、`case-detail-client.tsx` |
| 历史组件（PascalCase） | 保留，不重命名 | `AuthGuard.tsx`、`LoginForm.tsx`、`PatientList.tsx` |
| 页面/布局/错误 | Next.js 约定 | `page.tsx`、`layout.tsx`、`loading.tsx`、`error.tsx`、`not-found.tsx` |
| Hooks | `use-*.ts` / `use-*.tsx` | `use-debounce.ts`、`use-mobile.tsx` |
| 非组件 TS | **camelCase** 或 **kebab-case** `.ts` | `patientService.ts`、`api-endpoints.ts` |
| 类型定义 | PascalCase `.ts` 在 `types/` | `Patient.ts`、`MedicalRecord.ts` |
| 测试 | `*.test.ts(x)` 在 `__tests__/` | `utils.test.ts`、`stores.test.ts` |
| 常量配置 | kebab-case | `brand-constants.ts`、`seo-config.ts` |

**对历史 PascalCase 组件的处理**：

- ❌ 不批量重命名（会破坏太多导入）
- ✅ 新代码一律用 kebab-case
- ✅ 修改历史文件时保持其原有命名

## 组件命名

- 组件标识符：PascalCase（无论文件名）— `function PatientCard() {}`
- 页面组件：导出默认的 `Page` 后缀可选；Next.js App Router 强制 `export default`
- 布局组件：`Layout` 后缀（如 `DashboardLayout`、`AuthLayout`）
- HOC：以 `with` 开头（如 `withAuth`、`withErrorBoundary`）

## 导出规范

- **默认导出**：每文件至多 1 个，名称匹配文件名
- **命名导出**：组件库 / 工具集合使用命名导出
- **类型导出**：`export interface` / `export type`，命名导出
- **桶文件（barrel）**：`index.ts` 在 `components/`、`hooks/`、`store/`、`services/`、`contexts/`、`types/` 根目录，便于 `@/components` 风格导入

## 导入顺序

```tsx
// 1. React / Next.js
import { useState } from "react"
import Link from "next/link"

// 2. 第三方库
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

// 3. 内部模块（@/ 别名）
import { useAuth } from "@/hooks"
import { formatDate } from "@/lib/utils"

// 4. 相对路径
import { PatientCard } from "../PatientCard"

// 5. 类型
import type { Patient } from "@/types"

// 6. 样式
import "./styles.css"
```

## 同名跨目录组件

仓库中存在 9 对同名组件位于不同功能目录（如 `admin/settings/settings-client.tsx` vs `settings/settings-client.tsx`）。这是合法的"域变体"（admin 视角 vs 用户视角），**不算重复**。新增同名组件必须：

1. 位于明确的功能子目录（不允许根 `components/` 直接新增）
2. 在 PR 描述中说明与既有同名的差异
3. 桶文件 `components/index.ts` 只能 re-export 其中一份（避免冲突）

## 测试命名

- 文件：`<被测模块名>.test.ts(x)`，放在 `__tests__/` 对应子目录
- 描述：`describe("<模块路径>")` → `it("<行为>")`
- 风格：行为驱动（"returns X when Y"），避免实现细节断言
