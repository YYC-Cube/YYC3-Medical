import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '医学知识图谱 | YYC³-Med',
  description:
    'YYC³-Med AI-Powered Intelligent Medical System. 言启立方于万象，语枢智云守健康. Words Initiate Cube Amid Vast Scenarios, Language Serves as Core, Smart Cloud Guards Health',
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
