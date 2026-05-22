-- ============================================
-- YYC³-Med 医疗AI系统 - 初始数据插入脚本
-- insert-initial-data.sql
-- 创建时间: 2024-01-15
-- 版本: v1.0.0
-- ============================================

-- 1. 插入用户
INSERT INTO users (id, full_name, email, phone, role, is_active, last_login) VALUES
('00000000-0000-0000-0000-000000000001', '系统管理员', 'admin@yyc3-med.com', '13800000001', 'admin', true, NOW()),
('00000000-0000-0000-0000-000000000002', '张医生', 'zhang@yyc3-med.com', '13800000002', 'doctor', true, NOW()),
('00000000-0000-0000-0000-000000000003', '李护士', 'li@yyc3-med.com', '13800000003', 'nurse', true, NOW()),
('00000000-0000-0000-0000-000000000004', '研究员王', 'wang@yyc3-med.com', '13800000004', 'researcher', true, NOW());

-- 2. 插入患者
INSERT INTO patients (id, patient_id, full_name, gender, date_of_birth, phone, email, blood_type, created_at) VALUES
('10000000-0000-0000-0000-000000000001', 'P20240001', '陈小明', '男', '1985-06-15', '13900000001', 'chen@example.com', 'A', NOW()),
('10000000-0000-0000-0000-000000000002', 'P20240002', '林美丽', '女', '1990-03-22', '13900000002', 'lin@example.com', 'B', NOW());

-- 3. 插入医疗记录
INSERT INTO medical_records (id, patient_id, record_type, title, description, symptoms, diagnosis, treatment_plan, visit_date) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '初诊', '普通感冒', '患者出现发热、咳嗽等症状', '发热, 咳嗽', '普通感冒', '休息, 多喝水, 对症治疗', '2024-01-10'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '复诊', '慢性胃炎', '患者胃部不适，伴随恶心', '胃痛, 恶心', '慢性胃炎', '调整饮食, 药物治疗', '2024-01-12');

-- 4. 插入药物
INSERT INTO medications (id, drug_name, drug_code, manufacturer, dosage_form, strength, unit, created_at) VALUES
('30000000-0000-0000-0000-000000000001', '阿莫西林', 'AMX500', '国药集团', '胶囊', '500mg', '粒', NOW()),
('30000000-0000-0000-0000-000000000002', '奥美拉唑', 'OMZ20', '辉瑞制药', '片剂', '20mg', '片', NOW());

-- 5. 插入处方
INSERT INTO prescriptions (id, medical_record_id, patient_id, doctor_id, prescription_number, medications, instructions, status) VALUES
('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'RX2024001',
'[{"drug_id": "30000000-0000-0000-0000-000000000001", "drug_name": "阿莫西林", "dosage": "500mg", "frequency": "每日3次", "duration": "7天", "quantity": 21, "instructions": "饭后服用"}]',
'饭后服用，多喝水', 'active');

-- 6. 插入预约
INSERT INTO appointments (id, patient_id, doctor_id, appointment_type, appointment_date, duration_minutes, status, notes) VALUES
('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '门诊', '2024-01-20 09:00:00', 30, 'scheduled', '初诊预约'),
('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '复诊', '2024-01-22 14:00:00', 30, 'scheduled', '复诊预约');

-- 7. 插入认证信息
INSERT INTO certifications (id, user_id, certification_type, certification_number, issued_by, issue_date, expiry_date) VALUES
('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '执业医师证', 'DOC20240001', '国家卫健委', '2020-01-01', '2030-01-01');

-- 8. 插入研究项目
INSERT INTO research_projects (id, project_name, description, lead_researcher_id, start_date, end_date, status) VALUES
('70000000-0000-0000-0000-000000000001', 'AI辅助诊断研究', '探索AI在临床诊断中的应用', '00000000-0000-0000-0000-000000000004', '2024-01-01', '2025-12-31', 'active');

-- 9. 插入系统设置
INSERT INTO system_settings (id, setting_key, setting_value, setting_type, description, is_public) VALUES
('90000000-0000-0000-0000-000000000001', 'system_name', '言语云³医疗AI系统', 'string', '系统名称', true),
('90000000-0000-0000-0000-000000000002', 'system_version', '1.0.0', 'string', '系统版本', true),
('90000000-0000-0000-0000-000000000003', 'max_file_upload_size', '104857600', 'number', '最大文件上传大小(字节)', false),
('90000000-0000-0000-0000-000000000004', 'session_timeout', '3600', 'number', '会话超时时间(秒)', false),
('90000000-0000-0000-0000-000000000005', 'enable_ai_diagnosis', 'true', 'boolean', '是否启用AI诊断功能', false);

-- 10. 插入通知
INSERT INTO notifications (id, user_id, title, message, is_read, created_at) VALUES
('80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '系统更新通知', 'YYC³-Med系统已更新至v1.0.0版本', false, NOW());

-- 11. 插入AI诊断记录
INSERT INTO ai_diagnosis_records (id, medical_record_id, ai_model_name, ai_model_version, input_data, diagnosis_result, confidence_score, processing_time, human_review_status) VALUES
('90000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000001', 'YYC3-Med-Diagnosis-v1', '1.0.0',
 '{"symptoms": ["发热", "咳嗽"], "vital_signs": {"temperature": 38.2}}',
 '{"primary_diagnosis": "普通感冒", "confidence": 0.92, "recommendations": ["休息", "多喝水"]}',
 0.92, 1500, 'approved');

-- 12. 插入系统日志
INSERT INTO system_logs (id, user_id, action, resource_type, resource_id, details, ip_address, status, created_at) VALUES
('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'login', 'user', '00000000-0000-0000-0000-000000000001',
 '{"login_method": "password"}', '192.168.1.100', 'success', NOW()),

('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'create_patient', 'patient', '10000000-0000-0000-0000-000000000001',
 '{"patient_name": "陈小明"}', '192.168.1.101', 'success', NOW()),

('a0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'ai_diagnosis', 'medical_record', '20000000-0000-0000-0000-000000000001',
 '{"model": "YYC3-Med-Diagnosis-v1", "confidence": 0.92}', '192.168.1.101', 'success', NOW()),

('a0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'system_backup', 'system', NULL,
 '{"backup_type": "full", "size": "2.5GB"}', '192.168.1.100', 'success', NOW());
 
-- 13. 插入完成统计提示
SELECT 'YYC³-Med 初始数据插入完成！' AS message,
       (SELECT COUNT(*) FROM users) AS users_count,
       (SELECT COUNT(*) FROM patients) AS patients_count,
       (SELECT COUNT(*) FROM medical_records) AS medical_records_count,
       (SELECT COUNT(*) FROM medications) AS medications_count,
       (SELECT COUNT(*) FROM prescriptions) AS prescriptions_count,
       (SELECT COUNT(*) FROM appointments) AS appointments_count,
       (SELECT COUNT(*) FROM certifications) AS certifications_count,
       (SELECT COUNT(*) FROM research_projects) AS research_projects_count,
       (SELECT COUNT(*) FROM system_settings) AS system_settings_count,
       (SELECT COUNT(*) FROM notifications) AS notifications_count,
       (SELECT COUNT(*) FROM ai_diagnosis_records) AS ai_diagnosis_count,
       (SELECT COUNT(*) FROM system_logs) AS system_logs_count;
       