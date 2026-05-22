-- 扩展 model_registry 表结构
ALTER TABLE model_registry ADD COLUMN architecture TEXT;
ALTER TABLE model_registry ADD COLUMN parameters_count INT;
