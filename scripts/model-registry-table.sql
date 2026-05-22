-- 模型注册表设计
CREATE TABLE model_registry (
  model_name VARCHAR(255),
  version VARCHAR(50),
  path TEXT,
  status ENUM('active', 'archived') DEFAULT 'archived',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
