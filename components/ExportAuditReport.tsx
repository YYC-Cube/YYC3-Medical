import { useState } from 'react';

export default function ExportAuditReport() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [link, setLink] = useState('');

  const handleExport = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/export-report', { method: 'POST' });
      const data = await res.json();
      setLink(data.downloadUrl);
      setStatus('done');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={status === 'loading'}
      >
        📤 导出审查报告
      </button>
      {status === 'done' && (
        <p className="mt-2 text-green-600">
          ✅ 上传成功：
          <a href={link} className="underline" target="_blank">
            点击下载
          </a>
        </p>
      )}
      {status === 'error' && <p className="mt-2 text-red-600">❌ 上传失败，请稍后重试</p>}
    </div>
  );
}
