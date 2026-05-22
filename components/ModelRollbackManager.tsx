import React from 'react';

export default function ModelRollbackManager({ models, onRollback }) {
  // models: [{ model_name, version, status }]
  return (
    <div>
      <h3>模型版本管理</h3>
      <table>
        <thead>
          <tr>
            <th>模型名称</th>
            <th>版本</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {models.map(m => (
            <tr key={m.model_name + m.version}>
              <td>{m.model_name}</td>
              <td>{m.version}</td>
              <td>{m.status}</td>
              <td>
                {m.status !== 'active' && (
                  <button onClick={() => onRollback(m.model_name, m.version)}>
                    回滚到 {m.version}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
