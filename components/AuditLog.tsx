import { useEffect, useState } from 'react';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/model-actions-log')
      .then(res => res.json())
      .then(data => setLogs(data));
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>操作</th>
          <th>模型</th>
          <th>版本</th>
          <th>执行人</th>
          <th>时间</th>
        </tr>
      </thead>
      <tbody>
        {logs.map(log => (
          <tr key={log.id}>
            <td>{log.action_type}</td>
            <td>{log.model_name}</td>
            <td>{log.version}</td>
            <td>{log.performed_by}</td>
            <td>{log.timestamp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
