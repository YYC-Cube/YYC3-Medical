import { useEffect, useState } from 'react';

export default function ReportList() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch('/api/tos-report-list')
      .then(res => res.json())
      .then(setReports);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📁 审查报告列表</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th>文件名</th>
            <th>生成时间</th>
            <th>签名状态</th>
            <th>下载</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, i) => (
            <tr key={i} className="border-t">
              <td>{r.filename}</td>
              <td>{r.timestamp ? new Date(r.timestamp).toLocaleString() : '未知'}</td>
              <td className={r.verified ? 'text-green-600' : 'text-red-600'}>
                {r.verified ? '✅ 校验通过' : '❌ 校验失败'}
              </td>
              <td>
                <a href={r.url} target="_blank" className="text-blue-600 underline">
                  下载
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
