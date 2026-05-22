import { useEffect, useState } from 'react';

export default function ReportDiffViewer({ from, to }) {
  const [diffs, setDiffs] = useState([]);

  useEffect(() => {
    fetch(`/api/report-diff?from=${from}&to=${to}`)
      .then(res => res.json())
      .then(setDiffs);
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
