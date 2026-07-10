import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from '@/components/ui/recharts-dynamic';

export default function DiagnosisABTestChart({
  data,
}: {
  data: Array<Record<string, string | number>>;
}) {
  // data: [{ test_group: 'A', accuracy: 0.91, recall: 0.87 }, { test_group: 'B', accuracy: 0.93, recall: 0.89 }]
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="test_group" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="accuracy" fill="var(--primary)" name="准确率" />
        <Bar dataKey="recall" fill="var(--success)" name="召回率" />
      </BarChart>
    </ResponsiveContainer>
  );
}
