-- ============================================
-- YYC³-Med 医疗AI系统 - 数据库结构定义脚本
-- create-tables.sql
-- 创建时间: 2024-01-15
-- 版本: v1.0.0
-- ============================================

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'doctor', 'nurse', 'researcher', 'patient') DEFAULT 'doctor',
    department VARCHAR(100),
    license_number VARCHAR(50),
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 患者表
CREATE TABLE IF NOT EXISTS patients (
    id CHAR(36) PRIMARY KEY,
    patient_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    gender ENUM('male', 'female', 'other'),
    date_of_birth DATE,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    blood_type VARCHAR(5),
    allergies TEXT,
    medical_history TEXT,
    insurance_info JSON,
    created_by CHAR(36),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 医疗记录表
CREATE TABLE IF NOT EXISTS medical_records (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36),
    doctor_id CHAR(36),
    record_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    symptoms TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    medications JSON,
    test_results JSON,
    images JSON,
    ai_analysis JSON,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    visit_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);

-- AI诊断记录表
CREATE TABLE IF NOT EXISTS ai_diagnosis_records (
    id CHAR(36) PRIMARY KEY,
    medical_record_id CHAR(36),
    ai_model_name VARCHAR(100) NOT NULL,
    ai_model_version VARCHAR(20),
    input_data JSON NOT NULL,
    diagnosis_result JSON NOT NULL,
    confidence_score DECIMAL(5,4),
    processing_time INT,
    human_review_status ENUM('pending', 'approved', 'rejected', 'modified') DEFAULT 'pending',
    human_reviewer_id CHAR(36),
    human_review_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE CASCADE,
    FOREIGN KEY (human_reviewer_id) REFERENCES users(id)
);

-- 医疗图像表
CREATE TABLE IF NOT EXISTS medical_images (
    id CHAR(36) PRIMARY KEY,
    medical_record_id CHAR(36),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(50),
    modality VARCHAR(20),
    body_part VARCHAR(50),
    image_metadata JSON,
    ai_annotations JSON,
    manual_annotations JSON,
    upload_status ENUM('processing', 'completed', 'failed') DEFAULT 'processing',
    uploaded_by CHAR(36),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- 认证证书表
CREATE TABLE IF NOT EXISTS certifications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    certificate_type VARCHAR(100) NOT NULL,
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    issuing_authority VARCHAR(200) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    certificate_file_path TEXT,
    verification_status ENUM('pending', 'verified', 'rejected', 'expired') DEFAULT 'pending',
    verification_provider VARCHAR(50),
    verification_date DATETIME,
    verification_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 药物信息表
CREATE TABLE IF NOT EXISTS medications (
    id CHAR(36) PRIMARY KEY,
    drug_name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200),
    brand_names JSON,
    drug_class VARCHAR(100),
    dosage_forms JSON,
    strength_options JSON,
    indications TEXT,
    contraindications TEXT,
    side_effects TEXT,
    interactions JSON,
    dosage_guidelines JSON,
    pregnancy_category VARCHAR(10),
    is_prescription BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 处方表
CREATE TABLE IF NOT EXISTS prescriptions (
    id CHAR(36) PRIMARY KEY,
    medical_record_id CHAR(36),
    patient_id CHAR(36),
    doctor_id CHAR(36),
    prescription_number VARCHAR(50) UNIQUE NOT NULL,
    medications JSON NOT NULL,
    instructions TEXT,
    status ENUM('active', 'dispensed', 'cancelled', 'expired') DEFAULT 'active',
    prescribed_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    expiry_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);

-- 预约表
CREATE TABLE IF NOT EXISTS appointments (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36),
    doctor_id CHAR(36),
    appointment_type VARCHAR(50) NOT NULL,
    appointment_date DATETIME NOT NULL,
    duration_minutes INT DEFAULT 30,
    status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    notes TEXT,
    telemedicine_link TEXT,
    reminder_sent BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);

-- 研究项目表
CREATE TABLE IF NOT EXISTS research_projects (
    id CHAR(36) PRIMARY KEY,
    project_name VARCHAR(200) NOT NULL,
    project_code VARCHAR(50) UNIQUE NOT NULL,
    principal_investigator_id CHAR(36),
    description TEXT,
    objectives TEXT,
    methodology TEXT,
    status ENUM('planning', 'active', 'paused', 'completed', 'cancelled') DEFAULT 'planning',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    funding_source VARCHAR(200),
    ethics_approval_number VARCHAR(100),
    ethics_approval_date DATE,
    participant_count INT DEFAULT 0,
    data_collection_status VARCHAR(20) DEFAULT 'not_started',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (principal_investigator_id) REFERENCES users(id)
);

-- 研究数据表
CREATE TABLE IF NOT EXISTS research_data (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36),
    patient_id CHAR(36),
    data_type VARCHAR(50) NOT NULL,
    data_content JSON NOT NULL,
    collection_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    collected_by CHAR(36),
    quality_score DECIMAL(3,2),
    is_anonymized BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES research_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (collected_by) REFERENCES users(id)
);

-- 系统日志表
CREATE TABLE IF NOT EXISTS system_logs (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id CHAR(36),
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status ENUM('success', 'failure', 'warning') DEFAULT 'success',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 通知表（修复语法）
CREATE TABLE IF NOT EXISTS notifications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 系统配置表（增强版）
CREATE TABLE IF NOT EXISTS system_settings (
    id CHAR(36) PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSON NOT NULL,
    setting_type ENUM('string', 'number', 'boolean', 'json') NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by CHAR(36),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- 15. 索引优化
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_patients_patient_id ON patients(patient_id);
CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX idx_medical_records_visit_date ON medical_records(visit_date);
CREATE INDEX idx_ai_diagnosis_records_medical_record_id ON ai_diagnosis_records(medical_record_id);
CREATE INDEX idx_certifications_user_id ON certifications(user_id);
CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- 可选索引（如字段存在）
-- CREATE INDEX idx_users_username ON users(username);
-- CREATE INDEX idx_medical_records_doctor_id ON medical_records(doctor_id);
-- CREATE INDEX idx_medical_images_medical_record_id ON medical_images(medical_record_id);
-- CREATE INDEX idx_certifications_verification_status ON certifications(verification_status);
-- CREATE INDEX idx_research_data_project_id ON research_data(project_id);

-- 16. 视图定义：患者汇总视图
CREATE OR REPLACE VIEW patient_summary AS
SELECT 
    p.id,
    p.patient_id,
    p.full_name,
    p.gender,
    p.date_of_birth,
    TIMESTAMPDIFF(YEAR, p.date_of_birth, CURDATE()) AS age,
    p.phone,
    p.email,
    COUNT(mr.id) AS total_records,
    MAX(mr.visit_date) AS last_visit,
    p.created_at
FROM patients p
LEFT JOIN medical_records mr ON p.id = mr.patient_id
GROUP BY p.id, p.patient_id, p.full_name, p.gender, p.date_of_birth, p.phone, p.email, p.created_at;

-- ✅ 结构创建完成提示
SELECT 'YYC³-Med 数据库结构创建完成！' AS message;
