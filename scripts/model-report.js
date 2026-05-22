// 示例：自动生成模型评估报告
const fs = require('fs');
const data = require('../data/model_performance.json');

function groupByModel(data) {
  return data.reduce((acc, row) => {
    acc[row.model_name] = acc[row.model_name] || [];
    acc[row.model_name].push(row);
    return acc;
  }, {});
}

function generateSummary(groupedData) {
  return Object.entries(groupedData)
    .map(([model, metrics]) => {
      const acc = metrics.find(m => m.metric_name === 'accuracy')?.value;
      const rec = metrics.find(m => m.metric_name === 'recall')?.value;
      return `${model} 模型的准确率为 ${acc}，召回率为 ${rec}。`;
    })
    .join('\n');
}

const grouped = groupByModel(data);
const summary = generateSummary(grouped);
fs.writeFileSync('model-report.txt', summary);
console.log('模型评估报告已生成：model-report.txt');
