import { useEffect, useState } from 'react';

export default function CiStatus({ ciRunId }: { ciRunId: string }) {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/ci-status?runId=${ciRunId}`)
      .then(res => res.json())
      .then(setStatus);
  }, [ciRunId]);

  if (!status) return <p>加载中...</p>;

  return (
    <div className="p-6 border rounded bg-gray-50">
      <h2 className="text-lg font-bold mb-2">🚦 CI 审查状态</h2>
      <p>任务编号: {status.runId}</p>
      <p>提交版本: {status.commitHash}</p>
      <p>审查时间: {new Date(status.timestamp).toLocaleString()}</p>
      <p>
        状态:{' '}
        <span className={status.passed ? 'text-green-600' : 'text-red-600'}>
          {status.passed ? '通过' : '失败'}
        </span>
      </p>
    </div>
  );
}
