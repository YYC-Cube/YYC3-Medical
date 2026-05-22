-- ⚠️ 注意：此脚本将清空所有业务数据，但保留表结构
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE users;
TRUNCATE TABLE patients;
TRUNCATE TABLE medical_records;
TRUNCATE TABLE ai_diagnosis_records;
TRUNCATE TABLE medical_images;
TRUNCATE TABLE certifications;
TRUNCATE TABLE medications;
TRUNCATE TABLE prescriptions;
TRUNCATE TABLE appointments;
TRUNCATE TABLE research_projects;
TRUNCATE TABLE research_data;
TRUNCATE TABLE system_logs;
TRUNCATE TABLE notifications;
TRUNCATE TABLE system_settings;
TRUNCATE TABLE maintenance_tasks;

SET FOREIGN_KEY_CHECKS = 1;

SELECT '✅ 所有表数据已清空' AS message;
