import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from '@/components/ui/recharts-dynamic';

interface PerformanceData {
  metric_name: string;
  [key: string]: string | number;
}

export default function PerformanceChart({ data }: { data: PerformanceData[] }) {
  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="metric_name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="GPT-4-Med" stroke="var(--primary)" />
      <Line type="monotone" dataKey="BioMedLM" stroke="var(--success)" />
      <Line type="monotone" dataKey="YYC³-Expert" stroke="var(--warning)" />
    </LineChart>
  );
}
