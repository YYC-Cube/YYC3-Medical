CREATE TABLE audit_reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  entity_name VARCHAR(255),
  table_name VARCHAR(255),
  column_name VARCHAR(255),
  entity_type VARCHAR(255),
  db_type VARCHAR(255),
  status ENUM('一致', '不一致', '表缺失', '字段缺失'),
  notes TEXT,
  ci_run_id VARCHAR(255),
  commit_hash VARCHAR(255),
  auditor VARCHAR(255)
);
