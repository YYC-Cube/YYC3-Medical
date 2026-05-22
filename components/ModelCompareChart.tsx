import { RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

export default function ModelCompareChart({ versions }) {
  return (
    <RadarChart data={versions} outerRadius={120} width={400} height={300}>
      <PolarGrid />
      <PolarAngleAxis dataKey="version" />
      <Radar name="Accuracy" dataKey="accuracy" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      <Radar name="Recall" dataKey="recall" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
    </RadarChart>
  );
}
