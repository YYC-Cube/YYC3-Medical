// ...existing content from 混淆产物/PerformanceChart.tsx...import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface PerformanceData {
  metric_name: string;
  [key: string]: any;
}

export default function PerformanceChart({ data }: { data: PerformanceData[] }) {
  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="metric_name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="GPT-4-Med" stroke="#8884d8" />
      <Line type="monotone" dataKey="BioMedLM" stroke="#82ca9d" />
      <Line type="monotone" dataKey="YYC³-Expert" stroke="#ff7300" />
    </LineChart>
  );
}
