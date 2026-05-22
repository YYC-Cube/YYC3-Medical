import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// 配置：私钥路径
const privateKeyPath = path.join(process.cwd(), 'keys', 'private.pem');
const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');

async function generateSignatureChain({ filename, commit_hash, ci_run_id, auditor }) {
  const filePath = path.join(process.cwd(), 'public', filename);
  const content = fs.readFileSync(filePath);
  const sha256 = crypto.createHash('sha256').update(content).digest('hex');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(content);
  sign.end();
  const rsa_signature = sign.sign(privateKey, 'base64');

  const meta = {
    filename,
    sha256,
    rsa_signature,
    commit_hash,
    ci_run_id,
    timestamp: new Date().toISOString(),
    auditor,
    verified: true
  };
  const metaPath = path.join(process.cwd(), 'public', `${filename}.meta.json`);
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
  console.log('✅ 签名链已生成:', metaPath);
}

// 用法: node scripts/generate-report-signature-chain.js audit-report-v2.pdf 34c1a6e ci-20250916-001 copilot
const [filename, commit_hash, ci_run_id, auditor] = process.argv.slice(2);
if (!filename || !commit_hash || !ci_run_id || !auditor) {
  console.error('用法: node scripts/generate-report-signature-chain.js <filename> <commit_hash> <ci_run_id> <auditor>');
  process.exit(1);
}
generateSignatureChain({ filename, commit_hash, ci_run_id, auditor });
