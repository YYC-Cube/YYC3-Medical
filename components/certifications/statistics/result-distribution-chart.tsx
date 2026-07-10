'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from '@/components/ui/recharts-dynamic';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const mockDistributionData = [
  { name: '验证成功', value: 1250, color: 'var(--success)' },
  { name: '验证失败', value: 180, color: 'var(--destructive)' },
  { name: '待处理', value: 95, color: 'var(--warning)' },
  { name: '已过期', value: 45, color: 'var(--muted-foreground)' },
];

export function ResultDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>验证结果分布</CardTitle>
        <CardDescription>认证验证结果的分布情况</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              success: {
                label: '验证成功',
                color: 'var(--success)',
              },
              failed: {
                label: '验证失败',
                color: 'var(--destructive)',
              },
              pending: {
                label: '待处理',
                color: 'var(--warning)',
              },
              expired: {
                label: '已过期',
                color: 'var(--muted-foreground)',
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="var(--primary)"
                  dataKey="value"
                >
                  {mockDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {mockDistributionData.map(item => (
            <div key={item.name} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
