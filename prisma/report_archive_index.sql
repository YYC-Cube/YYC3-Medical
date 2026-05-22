CREATE TABLE report_archive_index (
  id INT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(255),
  version VARCHAR(20),
  commit_hash VARCHAR(64),
  ci_run_id VARCHAR(64),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  auditor VARCHAR(255),
  verified BOOLEAN,
  download_count INT DEFAULT 0
);
