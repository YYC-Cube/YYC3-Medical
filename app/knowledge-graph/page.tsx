import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '医学知识图谱',
  description: 'YanYuCloud智能诊疗系统医学知识图谱可视化',
};

import { KnowledgeGraphVisualization } from '../../components/knowledge-base/knowledge-graph-visualization';

export default function KnowledgeGraphPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">医学知识图谱</h1>
      <KnowledgeGraphVisualization graphId="lung-nodule-graph" height={700} />
    </div>
  );
}
