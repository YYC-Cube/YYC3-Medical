import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const REPORT_FILENAME = 'audit-report-v2.pdf';
const REPORT_PATH = path.join(process.cwd(), 'public', REPORT_FILENAME);
const PRIVATE_KEY_PATH = path.join(process.cwd(), 'keys', 'private.pem');

function generateMeta() {
  const content = fs.readFileSync(REPORT_PATH);
  const sha256 = crypto.createHash('sha256').update(content).digest('hex');

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(content);
  signer.end();
  const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf-8');
  const rsaSignature = signer.sign(privateKey, 'base64');

  const meta = {
    filename: REPORT_FILENAME,
    sha256,
    rsa_signature: rsaSignature,
    commit_hash: process.env.GIT_COMMIT ?? 'unknown',
    ci_run_id: process.env.CI_RUN_ID ?? 'manual',
    timestamp: new Date().toISOString(),
    auditor: 'copilot',
    verified: true
  };

  const metaPath = path.join(process.cwd(), 'public', `${REPORT_FILENAME}.meta.json`);
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
  console.log(`✅ 元数据文件已生成: ${metaPath}`);
}

generateMeta();
