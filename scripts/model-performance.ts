// ...existing content from 混淆产物/model-performance.ts...import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db'; // 假设有数据库连接模块

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const data = await db.query(`
      SELECT model_name, metric_name, value
      FROM model_performance
      ORDER BY model_name, metric_name
    `);
    res.status(200).json({ data });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
