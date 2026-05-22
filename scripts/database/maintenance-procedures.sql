-- ============================================
-- YYC³-Med 医疗AI系统 - 数据库维护存储过程
-- maintenance-procedures.sql
-- 创建时间: 2024-01-15
-- 版本: v1.0.0
-- ============================================

-- 1. 清理旧数据
DROP PROCEDURE IF EXISTS cleanup_old_data;
DELIMITER //
CREATE PROCEDURE cleanup_old_data()
BEGIN
    DECLARE deleted_logs INT DEFAULT 0;
    DECLARE deleted_notifications INT DEFAULT 0;

    DELETE FROM system_logs WHERE created_at < NOW() - INTERVAL 90 DAY;
    SET deleted_logs = ROW_COUNT();

    DELETE FROM notifications WHERE is_read = TRUE AND created_at < NOW() - INTERVAL 30 DAY;
    SET deleted_notifications = ROW_COUNT();

    UPDATE appointments
    SET status = 'expired'
    WHERE status IN ('cancelled', 'no_show') AND appointment_date < NOW() - INTERVAL 7 DAY;

    INSERT INTO system_logs (user_id, action, resource_type, details, status, created_at)
    VALUES (
        NULL,
        'database_cleanup',
        'system',
        JSON_OBJECT('deleted_logs', deleted_logs, 'deleted_notifications', deleted_notifications),
        'success',
        NOW()
    );
END //
DELIMITER ;

-- 2. AI诊断统计
DROP PROCEDURE IF EXISTS get_ai_diagnosis_statistics;
DELIMITER //
CREATE PROCEDURE get_ai_diagnosis_statistics()
BEGIN
    SELECT 
        ai_model_name,
        COUNT(*) AS total_diagnoses,
        SUM(human_review_status = 'approved') AS approved_count,
        SUM(human_review_status = 'rejected') AS rejected_count,
        SUM(human_review_status = 'pending') AS pending_count,
        ROUND(AVG(confidence_score), 4) AS average_confidence,
        ROUND(AVG(processing_time)) AS average_processing_time
    FROM ai_diagnosis_records
    GROUP BY ai_model_name
    ORDER BY total_diagnoses DESC;
END //
DELIMITER ;

-- 3. 患者数据完整性检查
DROP PROCEDURE IF EXISTS check_patient_data_integrity;
DELIMITER //
CREATE PROCEDURE check_patient_data_integrity()
BEGIN
    SELECT '患者基本信息缺失' AS check_type,
           COUNT(*) AS issue_count,
           '患者缺少姓名、性别或出生日期' AS details
    FROM patients
    WHERE full_name IS NULL OR gender IS NULL OR date_of_birth IS NULL;

    SELECT '孤立医疗记录' AS check_type,
           COUNT(*) AS issue_count,
           '医疗记录对应的患者不存在' AS details
    FROM medical_records mr
    LEFT JOIN patients p ON mr.patient_id = p.id
    WHERE p.id IS NULL;

    SELECT '无效预约记录' AS check_type,
           COUNT(*) AS issue_count,
           '预约记录中的医生或患者不存在' AS details
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    LEFT JOIN users u ON a.doctor_id = u.id
    WHERE p.id IS NULL OR u.id IS NULL;
END //
DELIMITER ;

-- 4. 用户活跃度统计
DROP PROCEDURE IF EXISTS get_user_activity_statistics;
DELIMITER //
CREATE PROCEDURE get_user_activity_statistics(IN days_back INT)
BEGIN
    SELECT 
        u.id AS user_id,
        u.full_name,
        u.role,
        SUM(sl.action = 'login') AS login_count,
        MAX(sl.created_at) AS last_login,
        COUNT(sl.id) AS total_actions
    FROM users u
    LEFT JOIN system_logs sl ON u.id = sl.user_id
        AND sl.created_at >= NOW() - INTERVAL days_back DAY
    WHERE u.is_active = TRUE
    GROUP BY u.id, u.full_name, u.role
    ORDER BY total_actions DESC;
END //
DELIMITER ;

-- 5. 数据库性能优化
DROP PROCEDURE IF EXISTS optimize_database_performance;
DELIMITER //
CREATE PROCEDURE optimize_database_performance()
BEGIN
    ANALYZE TABLE users;
    ANALYZE TABLE patients;
    ANALYZE TABLE medical_records;
    ANALYZE TABLE ai_diagnosis_records;
    ANALYZE TABLE appointments;
    ANALYZE TABLE system_logs;
    ANALYZE TABLE notifications;

    INSERT INTO system_logs (user_id, action, resource_type, details, status, created_at)
    VALUES (
        NULL,
        'database_optimization',
        'system',
        JSON_OBJECT('message', '表统计信息已更新'),
        'success',
        NOW()
    );
END //
DELIMITER ;

-- 6. 表统计信息
DROP PROCEDURE IF EXISTS update_database_statistics;
DELIMITER //
CREATE PROCEDURE update_database_statistics()
BEGIN
    SELECT 
        table_name,
        table_rows AS row_count,
        CONCAT(ROUND(data_length / 1024 / 1024, 2), ' MB') AS data_size,
        CONCAT(ROUND(index_length / 1024 / 1024, 2), ' MB') AS index_size,
        CONCAT(ROUND((data_length + index_length) / 1024 / 1024, 2), ' MB') AS total_size
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
    ORDER BY (data_length + index_length) DESC;
END //
DELIMITER ;

-- 7. 备份约束验证
DROP PROCEDURE IF EXISTS verify_backup_integrity;
DELIMITER //
CREATE PROCEDURE verify_backup_integrity()
BEGIN
    SELECT 
        t.table_name,
        COUNT(tc.constraint_name) AS constraint_count,
        CASE 
            WHEN COUNT(tc.constraint_name) > 0 THEN 'OK'
            ELSE 'WARNING'
        END AS status
    FROM information_schema.tables t
    LEFT JOIN information_schema.table_constraints tc 
        ON t.table_name = tc.table_name 
        AND t.table_schema = tc.table_schema
    WHERE t.table_schema = DATABASE()
      AND t.table_type = 'BASE TABLE'
    GROUP BY t.table_name
    ORDER BY t.table_name;
END //
DELIMITER ;

-- 8. 调度维护任务
DROP PROCEDURE IF EXISTS schedule_maintenance_tasks;
DELIMITER //
CREATE PROCEDURE schedule_maintenance_tasks()
BEGIN
    DECLARE result_message TEXT DEFAULT '';

    CALL cleanup_old_data();

    IF DAYOFWEEK(CURDATE()) = 1 THEN
        CALL optimize_database_performance();
        SET result_message = CONCAT(result_message, '周度性能优化完成; ');
    END IF;

    IF DAY(CURDATE()) = 1 THEN
        CALL check_patient_data_integrity();

        INSERT INTO system_logs (user_id, action, resource_type, details, status, created_at)
        SELECT NULL, 'data_integrity_check', 'system',
               JSON_OBJECT('issues_found', COUNT(*)),
               IF(COUNT(*) = 0, 'success', 'warning'),
               NOW()
        FROM (
            SELECT id FROM patients WHERE full_name IS NULL OR gender IS NULL OR date_of_birth IS NULL
            UNION ALL
            SELECT mr.id FROM medical_records mr WHERE NOT EXISTS (
                SELECT 1 FROM patients p WHERE p.id = mr.patient_id
            )
            UNION ALL
            SELECT a.id FROM appointments a WHERE NOT EXISTS (
                SELECT 1 FROM patients p WHERE p.id = a.patient_id
            ) OR NOT EXISTS (
                SELECT 1 FROM users u WHERE u.id = a.doctor_id
            )
        ) AS issues;

        SET result_message = CONCAT(result_message, '月度数据完整性检查完成; ');
    END IF;

    SELECT result_message AS message;
END //
DELIMITER ;

-- 9. 调度维护任务
DELIMITER //

CREATE PROCEDURE schedule_maintenance_tasks()
BEGIN
    DECLARE result_message TEXT DEFAULT '';

    -- 每日清理任务
    CALL cleanup_old_data();

    -- 每周性能优化（周日）
    IF DAYOFWEEK(CURDATE()) = 1 THEN
        CALL optimize_database_performance();
        SET result_message = CONCAT(result_message, '周度性能优化完成; ');
    END IF;

    -- 每月数据完整性检查（每月1号）
    IF DAY(CURDATE()) = 1 THEN
        CALL check_patient_data_integrity();

        INSERT INTO system_logs (user_id, action, resource_type, details, status, created_at)
        SELECT NULL, 'data_integrity_check', 'system',
               JSON_OBJECT('issues_found', COUNT(*)),
               IF(COUNT(*) = 0, 'success', 'warning'),
               NOW()
        FROM (
            SELECT * FROM patients WHERE full_name IS NULL OR gender IS NULL OR date_of_birth IS NULL
            UNION ALL
            SELECT * FROM medical_records mr WHERE NOT EXISTS (
                SELECT 1 FROM patients p WHERE p.id = mr.patient_id
            )
            UNION ALL
            SELECT * FROM appointments a WHERE NOT EXISTS (
                SELECT 1 FROM patients p WHERE p.id = a.patient_id
            ) OR NOT EXISTS (
                SELECT 1 FROM users u WHERE u.id = a.doctor_id
            )
        ) AS issues;

        SET result_message = CONCAT(result_message, '月度数据完整性检查完成; ');
    END IF;

    SELECT result_message AS message;
END //

DELIMITER ;

-- 10. 导出患者数据
DELIMITER //

CREATE PROCEDURE export_patient_data(IN patient_uuid CHAR(36))
BEGIN
    SELECT JSON_OBJECT(
        'patient_info', (
            SELECT JSON_OBJECT(
                'id', id,
                'patient_id', patient_id,
                'full_name', full_name,
                'gender', gender,
                'date_of_birth', date_of_birth,
                'phone', phone,
                'email', email,
                'blood_type', blood_type,
                'created_at', created_at
            ) FROM patients WHERE id = patient_uuid
        ),
        'medical_records', (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', id,
                    'record_type', record_type,
                    'title', title,
                    'description', description,
                    'symptoms', symptoms,
                    'diagnosis', diagnosis,
                    'treatment_plan', treatment_plan,
                    'visit_date', visit_date
                )
            ) FROM medical_records WHERE patient_id = patient_uuid
        ),
        'prescriptions', (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'prescription_number', prescription_number,
                    'medications', medications,
                    'instructions', instructions,
                    'prescribed_date', prescribed_date,
                    'status', status
                )
            ) FROM prescriptions WHERE patient_id = patient_uuid
        ),
        'appointments', (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'appointment_type', appointment_type,
                    'appointment_date', appointment_date,
                    'duration_minutes', duration_minutes,
                    'status', status,
                    'notes', notes
                )
            ) FROM appointments WHERE patient_id = patient_uuid
        )
    ) AS patient_data;

    INSERT INTO system_logs (user_id, action, resource_type, resource_id, details, status, created_at)
    VALUES (
        NULL,
        'export_patient_data',
        'patient',
        patient_uuid,
        JSON_OBJECT('export_timestamp', NOW()),
        'success',
        NOW()
    );
END //

DELIMITER ;

-- 创建维护任务执行记录表
CREATE TABLE IF NOT EXISTS maintenance_tasks (
    id CHAR(36) PRIMARY KEY,
    task_name VARCHAR(100) NOT NULL,
    execution_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    duration_seconds INT,
    status VARCHAR(20) DEFAULT 'success',
    result_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 添加注释
-- 清理过期的系统日志和通知数据：cleanup_old_data()
-- 更新数据库统计信息：update_database_statistics()
-- 检查患者数据完整性：check_patient_data_integrity()
-- 获取AI诊断统计信息：get_ai_diagnosis_statistics()
-- 获取用户活跃度统计：get_user_activity_statistics()
-- 优化数据库性能：optimize_database_performance()
-- 验证备份完整性：verify_backup_integrity()
-- 调度维护任务：schedule_maintenance_tasks()
-- 导出患者数据：export_patient_data()

-- 存储过程创建完成
SELECT 'YYC³-Med 数据库维护存储过程创建完成！' AS message;
