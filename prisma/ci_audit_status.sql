CREATE TABLE ci_audit_status (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ci_run_id VARCHAR(255),
  commit_hash VARCHAR(255),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  passed BOOLEAN,
  summary TEXT,
  auditor VARCHAR(255)
);
