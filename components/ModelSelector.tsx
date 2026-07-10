'use client';

import { useState } from 'react';

const models = ['GPT-4-Med', 'BioMedLM', 'YYC³-Expert'];

export default function ModelSelector({ onChange }: { onChange: (model: string) => void }) {
  const [selectedModel, setSelectedModel] = useState(models[0]);

  const handleChange = (model: string) => {
    setSelectedModel(model);
    onChange(model);
  };

  return (
    <div>
      <label>
        选择诊断模型：
        <select value={selectedModel} onChange={e => handleChange(e.target.value)}>
          {models.map((model: string) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
