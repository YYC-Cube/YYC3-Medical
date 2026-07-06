import { useEffect, useState } from 'react';

interface ReportDiff {
  entity: string
  column: string
  from: { status: string; type: string }
  to: { status: string; type: string }
}

export default function ReportDiffViewer({ from, to }: { from: string; to: string }) {
  const [diffs, setDiffs] = useState<ReportDiff[]>([]);

  useEffect(() => {
    // STATIC-EXPORT-NOTE: /api/report-diff 不存在于静态导出，这里保留接口契约。
    // 后续接入真实后端时，替换为 fetch 调用即可。
    setDiffs([])
  }, [from, to]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📊 报告版本对比</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th>实体</th>
            <th>字段</th>
            <th>版本 {from}</th>
            <th>版本 {to}</th>
          </tr>
        </thead>
        <tbody>
          {diffs.map((d, i) => (
            <tr key={i} className="border-t">
              <td>{d.entity}</td>
              <td>{d.column}</td>
              <td>
                {d.from.status} ({d.from.type})
              </td>
              <td>
                {d.to.status} ({d.to.type})
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
