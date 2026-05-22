import React from 'react';

export default function ModelReportManager() {
  const [models, setModels] = React.useState('');
  const [format, setFormat] = React.useState('pdf');
  const handleExport = async () => {
    const url = `/api/model-report/batch-${format}?models=${models}`;
    window.open(url, '_blank');
  };
  return (
    <div>
      <h3>批量导出模型评估报告</h3>
      <input
        type="text"
        placeholder="输入模型名,逗号分隔"
        value={models}
        onChange={e => setModels(e.target.value)}
        style={{ width: 300 }}
      />
      <select value={format} onChange={e => setFormat(e.target.value)}>
        <option value="pdf">PDF</option>
        <option value="md">Markdown</option>
      </select>
      <button onClick={handleExport}>导出报告</button>
    </div>
  );
}
