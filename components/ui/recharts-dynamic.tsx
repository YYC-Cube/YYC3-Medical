'use client';

/**
 * Recharts 动态加载包装器
 * 将 recharts 全量包拆分为独立 chunk，避免 5 个 370KB 超大 chunk 重复打包
 * 所有图表组件通过 next/dynamic 懒加载，首屏不加载 recharts
 */
import dynamic from 'next/dynamic';
import { LoadingSpinner } from './loading-spinner';

const Loading = () => (
  <div className="flex h-[300px] items-center justify-center">
    <LoadingSpinner />
  </div>
);

// 核心图表容器 — 懒加载
export const ResponsiveContainer = dynamic(
  () => import('recharts').then(m => m.ResponsiveContainer),
  { loading: Loading }
) as typeof import('recharts').ResponsiveContainer;

// 图表类型 — 懒加载
export const LineChart = dynamic(
  () => import('recharts').then(m => m.LineChart),
  { loading: Loading }
) as typeof import('recharts').LineChart;

export const BarChart = dynamic(
  () => import('recharts').then(m => m.BarChart),
  { loading: Loading }
) as typeof import('recharts').BarChart;

export const PieChart = dynamic(
  () => import('recharts').then(m => m.PieChart),
  { loading: Loading }
) as typeof import('recharts').PieChart;

export const AreaChart = dynamic(
  () => import('recharts').then(m => m.AreaChart),
  { loading: Loading }
) as typeof import('recharts').AreaChart;

export const RadarChart = dynamic(
  () => import('recharts').then(m => m.RadarChart),
  { loading: Loading }
) as typeof import('recharts').RadarChart;

export const ScatterChart = dynamic(
  () => import('recharts').then(m => m.ScatterChart),
  { loading: Loading }
) as typeof import('recharts').ScatterChart;

// 图表组件 — 直接导入（轻量级，仅类型/工厂函数）
export {
  Line,
  Bar,
  Pie,
  Cell,
  Area,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
  ReferenceDot,
  Scatter,
  ComposedChart,
  RadialBarChart,
  RadialBar,
  Treemap,
  Funnel,
  FunnelChart,
  Label,
  LabelList,
} from 'recharts';
