// 示例：模型回滚操作审计日志展示
const fs = require('fs');
const logs = require('../data/model_actions_log.json');

console.log('模型操作审计日志：');
logs.forEach(log => {
  console.log(
    `${log.timestamp} | ${log.performed_by} | ${log.action_type} | ${log.model_name} | ${log.version}`
  );
});
