/**
 * YYC³-Med 性能基线定义
 *
 * 基于五维评估框架（时间/空间/属性/事件/关联）的基线阈值。
 * 用于 CI 门禁验证和运行时性能监控告警。
 *
 * 参考: docs/YYC3-深度审核-性能优化.md
 *
 * 最近校准: 2026-07-10
 * 当前状态: 静态导出模式 (output: 'export')
 *
 * ── 技术债务记录 ──
 *
 * 1. 静态导出 route-level chunk 分割
 *    5 个 chunk 超过 350KB（最大 370KB）。这是静态导出模式下路由级代码分割的
 *    正常产物，按需加载不影响 LCP/FCP/TTI。若引入 SSR，Next.js 流式渲染
 *    将自动优化此问题。当前无需处理，详见 AGENTS.md Gotcha #16。
 *
 *    参考测量: CURRENT_BASELINE.bundle
 *
 * 2. PWA 图标体积质量预算
 *    所有图标保留无损 PNG（RGBA 透明通道），webp 格式供浏览器优先加载。
 *    质量预算详见 scripts/optimize-pwa-icons.mjs 的 BUDGETS 常量。
 *    CI 集成: .github/workflows/audit.yml → PWA Icon quality audit step。
 */

/** Core Web Vitals 阈值 */
export const CORE_WEB_VITALS = {
  LCP: { good: 2500, needsImprovement: 4000, poor: 4001 }, // ms
  INP: { good: 200, needsImprovement: 500, poor: 501 },
  CLS: { good: 0.1, needsImprovement: 0.25, poor: 0.26 },
  FCP: { good: 1800, needsImprovement: 3000, poor: 3001 },
  TTFB: { good: 800, needsImprovement: 1800, poor: 1801 },
} as const;

/** Bundle 体积基线 (KB, gzip) */
export const BUNDLE_BUDGETS = {
  /** 首页 JS 总大小 */
  initialLoadJS: 400, // KB
  /** 最大单 Chunk */
  maxChunkSize: 350, // KB
  /** CSS 总大小 */
  totalCSS: 100, // KB
  /** 总图片资源 */
  totalImages: 500, // KB
  /** 单文件最大图片 */
  maxImageSize: 200, // KB
} as const;

/** 静态导出基线 */
export const EXPORT_BUDGETS = {
  // 总导出体积
  totalExportSize: 30, // MB
  // 页面平均 HTML 大小
  avgPageHTML: 60, // KB
  // JS Chunks 总数
  chunkCount: 200,
} as const;

/** 当前实测值 (2026-07-10 基线) */
export const CURRENT_BASELINE = {
  bundle: {
    totalChunks: 184,
    totalJSSize: 8.5, // MB
    maxChunkSize: 369, // KB
    topChunks: [
      { size: 369, count: 5 }, // 5 chunks at 369KB
      { size: 222, count: 1 },
      { size: 134, count: 1 },
    ],
  },
  assets: {
    largestImage: { file: 'Family-001.jpg', size: 115 }, // KB (优化后)
    secondLargest: { file: 'icon-1024.png', size: 541 }, // KB (PWA, 只减小尺寸)
    totalExportSize: 23, // MB
  },
  tests: {
    total: 291,
    suites: 17,
    libUtilsCoverage: 91, // %
  },
  audit: {
    imageSavings: 334, // KB (Family-001.png 449KB → Family-001.jpg 115KB, -74%)
  },
} as const;

/** 性能告警阈值 */
export const ALERT_THRESHOLDS = {
  warning: 0.8, // 达到基线 80% 即预警
  critical: 0.95, // 达到基线 95% 即严重告警
} as const;

export type PerformanceBudgetName = keyof typeof BUNDLE_BUDGETS;
export type VitalName = keyof typeof CORE_WEB_VITALS;
