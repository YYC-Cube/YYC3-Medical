import { useEffect, useState } from 'react';

type ArchiveItem = {
  version: string;
  filename: string;
  timestamp: string;
  verified: boolean;
  url: string;
};

export default function ArchiveList() {
  const [archives, setArchives] = useState<ArchiveItem[]>([]);

  useEffect(() => {
    fetch('/api/archive-list')
      .then(res => res.json())
      .then(setArchives);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📁 审查报告归档列表</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th>版本</th>
            <th>文件名</th>
            <th>时间</th>
            <th>签名状态</th>
            <th>下载</th>
          </tr>
        </thead>
        <tbody>
          {archives.map((r, i) => (
            <tr key={i} className="border-t">
              <td>{r.version}</td>
              <td>{r.filename}</td>
              <td>{new Date(r.timestamp).toLocaleString()}</td>
              <td className={r.verified ? 'text-success' : 'text-destructive'}>
                {r.verified ? '✅ 可信' : '❌ 未验证'}
              </td>
              <td>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
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
