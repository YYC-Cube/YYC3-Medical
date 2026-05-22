-- ============================================
-- YYC³-Med 医疗AI系统 - 初始化入口脚本（MySQL）
-- 文件路径: scripts/database/init.sql
-- ============================================

-- 切换数据库（确保已创建）
USE yyc3_med;

-- ✅ 创建数据库结构
-- 请在命令行中执行：
-- mysql -u root -p yyc3_med < create-tables.sql

-- ✅ 插入初始数据
-- mysql -u root -p yyc3_med < insert-initial-data.sql

-- ✅ 创建维护存储过程
-- mysql -u root -p yyc3_med < maintenance-procedures.sql

-- ✅ 初始化完成提示
SELECT 'YYC³-Med MySQL 数据库初始化完成！' AS message;
