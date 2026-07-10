import { RadarChart, PolarGrid, PolarAngleAxis, Radar } from '@/components/ui/recharts-dynamic';

interface ModelCompareData {
  version: string;
  accuracy: number;
  recall: number;
}

export default function ModelCompareChart({ versions }: { versions: ModelCompareData[] }) {
  return (
    <RadarChart data={versions} outerRadius={120} width={400} height={300}>
      <PolarGrid />
      <PolarAngleAxis dataKey="version" />
      <Radar name="Accuracy" dataKey="accuracy" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.6} />
      <Radar name="Recall" dataKey="recall" stroke="var(--success)" fill="var(--success)" fillOpacity={0.6} />
    </RadarChart>
  );
}
