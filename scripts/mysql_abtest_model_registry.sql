-- 实验性 A/B 测试字段扩展
ALTER TABLE ai_diagnosis_records
ADD COLUMN model_variant VARCHAR(255),
ADD COLUMN test_group ENUM('A', 'B') DEFAULT 'A';

-- 模型版本注册表
CREATE TABLE IF NOT EXISTS model_registry (
  model_name VARCHAR(255) NOT NULL,
  version VARCHAR(50) NOT NULL,
  path TEXT NOT NULL,
  status ENUM('active', 'archived') DEFAULT 'archived',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (model_name, version)
);