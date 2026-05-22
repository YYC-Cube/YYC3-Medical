-- 创建模型性能评估表
CREATE TABLE model_performance (
  model_name VARCHAR(255),
  metric_name VARCHAR(255),
  value FLOAT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
