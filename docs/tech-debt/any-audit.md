# Tech Debt: `any` Type Audit

Generated: 2026-07-04

Total occurrences: **181**

## Breakdown by category

| Category | Count |
|----------|-------|
| `: any` (explicit) | 125 |
| `as any` (cast) | 43 |
| `<any>` (generic) | 13 |

## Top files

| Count | File |
|-------|------|
| 23 | `components/knowledge-base/knowledge-graph-visualization.tsx` |
| 10 | `services/data-export-service.ts` |
| 7 | `components/experiment-design.tsx` |
| 7 | `components/ethics-application-form.tsx` |
| 6 | `components/specialized-templates/template-detail.tsx` |
| 6 | `components/medical-records/batch-processor.tsx` |
| 5 | `lib/api/client.ts` |
| 5 | `components/clinical-decision/diagnostic-tools-client.tsx` |
| 4 | `lib/utils/object.ts` |
| 4 | `components/ui/lazy-load.tsx` |
| 4 | `components/admin/roles/roles-list.tsx` |
| 3 | `hooks/useApi.ts` |
| 3 | `components/ui/advanced-search.tsx` |
| 3 | `components/specialized-templates/template-manager.tsx` |
| 3 | `components/profile/ai-avatar-generator.tsx` |
| 3 | `components/medical-records/prescription-uploader.tsx` |
| 3 | `components/medical-records/ai-assisted-annotation.tsx` |
| 3 | `components/ethics-application-integration.tsx` |
| 3 | `components/analytics/data-comparison.tsx` |
| 3 | `components/admin/notifications/notification-templates.tsx` |

## Remediation plan

1. **Phase 5+**: Replace `any` in hooks/lib/services (pure logic, easy to type)
2. **Phase 6**: Replace `any` in UI components (requires prop typing)
3. **Phase 7**: Replace `any` in test fixtures and mock data
