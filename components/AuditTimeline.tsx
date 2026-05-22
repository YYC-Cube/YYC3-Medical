import { useEffect, useState } from 'react';

export default function AuditTimeline() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`/api/audit-history?page=${page}`)
      .then(res => res.json())
      .then(data => setRecords(data.records));
  }, [page]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📜 审查时间线</h2>
      <ul className="space-y-4">
        {records.map((r, i) => (
          <li
            key={i}
            className="border-l-4 pl-4"
            style={{ borderColor: r.status === '一致' ? 'green' : 'red' }}
          >
            <div className="text-sm text-gray-500">{new Date(r.timestamp).toLocaleString()}</div>
            <div className="font-semibold">
              {r.entity_name}.{r.column_name}
            </div>
            <div className="text-xs text-gray-600">状态: {r.status}</div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setPage(p => p + 1)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        加载更多
      </button>
    </div>
  );
}
