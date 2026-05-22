import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { AppDataSource } from '@/lib/db';
import { AuditReport } from '@/entities/AuditReport';
import { ReportArchiveIndex } from '@/entities/ReportArchiveIndex';

const VERSION = 'v2';
const COMMIT_HASH = process.env.GIT_COMMIT ?? 'unknown';
const CI_RUN_ID = process.env.CI_RUN_ID ?? 'manual';
const AUDITOR = 'copilot';

async function archiveReport() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(AuditReport);
  const records = await repo.find({ where: { report_version: VERSION } });

  // 1. 生成 CSV
  const csv = records.map(r =>
    `${r.entity_name},${r.column_name},${r.entity_type},${r.db_type},${r.status},${r.timestamp.toISOString()}`
  ).join('\n');
  const csvPath = path.join(process.cwd(), 'public', `audit-report-${VERSION}.csv`);
  fs.writeFileSync(csvPath, csv);

  // 2. 读取 PDF 内容
  const pdfPath = path.join(process.cwd(), 'public', `audit-report-${VERSION}.pdf`);
  const pdfContent = fs.readFileSync(pdfPath);

  // 3. 生成签名链
  const sha256 = crypto.createHash('sha256').update(pdfContent).digest('hex');
  const privateKey = fs.readFileSync('./keys/private.pem', 'utf-8');
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(pdfContent);
  signer.end();
  const rsaSignature = signer.sign(privateKey, 'base64');

  const meta = {
    filename: `audit-report-${VERSION}.pdf`,
    sha256,
    rsa_signature: rsaSignature,
    commit_hash: COMMIT_HASH,
    ci_run_id: CI_RUN_ID,
    timestamp: new Date().toISOString(),
    auditor: AUDITOR,
    verified: true
  };
  fs.writeFileSync(`${pdfPath}.meta.json`, JSON.stringify(meta, null, 2));

  // 4. 写入归档索引表
  const archiveRepo = AppDataSource.getRepository(ReportArchiveIndex);
  await archiveRepo.save({
    filename: meta.filename,
    version: VERSION,
    commit_hash: COMMIT_HASH,
    ci_run_id: CI_RUN_ID,
    timestamp: new Date(),
    auditor: AUDITOR,
    verified: true,
    download_count: 0
  });

  console.log('✅ 审查报告归档完成');
  await AppDataSource.destroy();
}

archiveReport();
