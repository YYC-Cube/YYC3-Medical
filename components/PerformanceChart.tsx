import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function PerformanceChart({ data }) {
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
