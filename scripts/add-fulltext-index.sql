-- 为 medical_records 表添加全文索引（MySQL 8+）
ALTER TABLE medical_records ADD FULLTEXT(title, diagnosis);
