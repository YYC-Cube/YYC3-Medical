-- Step ① 插入用户（users）
INSERT IGNORE INTO users (
  id, username, email, password_hash, full_name, role,
  department, license_number, phone, avatar_url,
  is_active, is_verified, last_login, created_at
) VALUES
('u-test-001', 'testuser', 'test@example.com', 'hashedpassword', '测试用户', 'doctor',
 NULL, NULL, '13000000000', NULL, TRUE, TRUE, NULL, NOW()),
('u-admin-001', 'admin', 'admin@yanyucloud.com', 'admin123', '管理员', 'admin',
 NULL, NULL, '13100000001', NULL, TRUE, TRUE, NULL, NOW()),
('u-doctor-001', 'doctor', 'doctor@yanyucloud.com', 'doctor123', '医生A', 'doctor',
 '呼吸科', 'DOC123456', '13200000002', NULL, TRUE, TRUE, NULL, NOW());

-- Step ② 插入患者（patients）
INSERT IGNORE INTO patients (
  id, patient_id, full_name, gender, date_of_birth, phone, email,
  address, emergency_contact_name, emergency_contact_phone,
  blood_type, allergies, medical_history, insurance_info,
  created_by, created_at
) VALUES
('p-test-001', 'PTEST001', '测试患者', 'male', '1990-01-01', '13000000000', 'ptest@example.com',
 '北京市朝阳区', '张三父亲', '13000000001', 'A', '无', '无既往病史', NULL,
 'u-test-001', NOW()),
('p-zhangsan', 'P0001', '张三', 'male', '1985-06-15', '13100000001', 'zhangsan@example.com',
 '上海市浦东新区', '李四', '13100000002', 'B', '青霉素', '高血压史', NULL,
 'u-doctor-001', NOW()),
('p-lisi', 'P0002', '李四', 'female', '1990-03-22', '13200000002', 'lisi@example.com',
 '广州市天河区', '王五', '13200000003', 'O', NULL, NULL, NULL,
 'u-doctor-001', NOW());

-- Step ③ 插入诊断记录（medical_records）
-- ⚠️ 移除不存在字段 confidence，字段严格匹配当前表结构
INSERT IGNORE INTO medical_records (
  id, patient_id, doctor_id, record_type, title, diagnosis,
  visit_date, status, created_at
) VALUES
('mr-test-001', 'p-test-001', 'u-test-001', '初诊', '测试记录', '测试诊断',
 NOW(), 'active', NOW()),
('mr-zhangsan-001', 'p-zhangsan', 'u-doctor-001', 'AI诊断', '肺部结节', '肺部结节，建议进一步检查',
 NOW(), 'active', NOW()),
('mr-lisi-001', 'p-lisi', 'u-doctor-001', 'AI诊断', '无异常', '无明显异常，建议定期复查',
 NOW(), 'active', NOW());

-- Step ④ 插入通知（notifications）
INSERT IGNORE INTO notifications (
  id, user_id, title, message, type, priority,
  is_read, action_url, expires_at, created_at
) VALUES
('n-test-001', 'u-test-001', '欢迎使用', '这是一个测试通知', 'system', 'normal',
 0, NULL, NULL, NOW());
