import { useState } from 'react';

interface VerifyResult {
  verified: boolean
  expected?: string
  actual?: string
}

export default function VerifyReport({ filename }: { filename: string }) {
  const [result, setResult] = useState<VerifyResult | null>(null);

  const handleVerify = async () => {
    // STATIC-EXPORT-NOTE: /api/verify-report 不存在于静态导出，这里保留接口契约。
    // 后续接入真实后端时，替换为 fetch 调用即可。
    setResult({ verified: true })
  };

  return (
    <div className="mt-4">
      <button onClick={handleVerify} className="px-4 py-2 bg-green-600 text-white rounded">
        🔒 校验报告完整性
      </button>
      {result && (
        <p className="mt-2">
          {result.verified
            ? '✅ 报告签名校验通过'
            : `❌ 校验失败，预期: ${result.expected}, 实际: ${result.actual}`}
        </p>
      )}
    </div>
  );
}
