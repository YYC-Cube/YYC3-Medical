import { useState } from 'react';

export default function SecureDownload({ filename }: { filename: string }) {
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid' | 'error'>('idle');

  const handleDownload = async () => {
    try {
      const metaRes = await fetch(`/api/report-signature?filename=${filename}`);
      const meta = await metaRes.json();

      const fileRes = await fetch(`/tos/files/audit/${filename}`);
      const fileBuffer = await fileRes.arrayBuffer();

      const publicKey = await crypto.subtle.importKey(
        'spki',
        await fetch('/keys/public.pem').then(r => r.arrayBuffer()),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['verify']
      );

      const isValid = await crypto.subtle.verify(
        'RSASSA-PKCS1-v1_5',
        publicKey,
        Uint8Array.from(atob(meta.rsa_signature), c => c.charCodeAt(0)),
        fileBuffer
      );

      setStatus(isValid ? 'valid' : 'invalid');
      if (isValid) window.open(`/tos/files/audit/${filename}`, '_blank');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div>
      <button onClick={handleDownload} className="px-4 py-2 bg-primary text-white rounded">
        📥 下载并校验报告
      </button>
      {status === 'valid' && <p className="text-success mt-2">✅ 签名校验通过</p>}
      {status === 'invalid' && <p className="text-destructive mt-2">❌ 签名校验失败</p>}
      {status === 'error' && <p className="text-warning mt-2">⚠️ 校验出错，请稍后重试</p>}
    </div>
  );
}
