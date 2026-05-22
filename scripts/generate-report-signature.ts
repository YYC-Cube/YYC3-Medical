import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { AppDataSource } from '@/lib/db';

async function generateSignature(filename: string) {
  const filePath = path.join(process.cwd(), 'public', filename);
  const content = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256').update(content).digest('hex');

  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository('report_signatures');
  await repo.insert({ filename, sha256_hash: hash, timestamp: new Date() });
  await AppDataSource.destroy();
  console.log(`✅ 签名已生成: ${filename} -> ${hash}`);
}

// 用法: node scripts/generate-report-signature.js audit-report-v2.md
const filename = process.argv[2];
if (!filename) {
  console.error('请指定报告文件名');
  process.exit(1);
}
generateSignature(filename);
