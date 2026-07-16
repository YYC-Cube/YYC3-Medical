import type { Metadata } from 'next';
import { ResearchAnalysisClient } from '@/components/research/research-analysis-client';

export const metadata: Metadata = {
  title: '研究数据分析',
  description: '医学研究数据分析工具',
};

export default function ResearchAnalysisPage() {
  return <ResearchAnalysisClient />;
}
