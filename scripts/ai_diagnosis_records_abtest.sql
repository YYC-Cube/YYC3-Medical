-- A/B测试字段优化
ALTER TABLE ai_diagnosis_records
ADD COLUMN model_variant VARCHAR(255),
ADD COLUMN test_group ENUM('A', 'B') DEFAULT 'A';
