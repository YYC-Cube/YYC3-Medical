-- 模型回滚/操作审计日志表
CREATE TABLE model_actions_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  action_type ENUM('rollback', 'update', 'delete'),
  model_name VARCHAR(255),
  version VARCHAR(50),
  performed_by VARCHAR(255),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
