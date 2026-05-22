import { useState } from 'react';

export default function VerifyReport({ filename }) {
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    const res = await fetch(`/api/verify-report?filename=${filename}`);
    const data = await res.json();
    setResult(data);
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
