// ...existing content from 混淆产物/update-model.ts...import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const registryPath = path.resolve(process.cwd(), 'model_registry.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { model } = req.body;
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    registry.diagnosis_model = model;
    registry.last_updated = new Date().toISOString();
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
