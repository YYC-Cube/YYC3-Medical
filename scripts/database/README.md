# 言语云³医疗AI系统 - 数据库脚本（MySQL）

## 概述

本目录包含言语云³医疗AI系统的数据库初始化和维护脚本，用于创建数据库表结构、插入初始数据、执行维护任务、验证结构一致性以及清空或备份数据。

## 文件结构

scripts/database/
├── create-tables.sql           # 数据库表结构创建脚本
├── insert-initial-data.sql     # 初始数据插入脚本
├── maintenance-procedures.sql  # 维护存储过程定义
├── reset-database.sql          # 清空所有表数据
├── test-data.sql               # 插入模拟测试数据
├── verify-schema.ts            # 验证数据库结构一致性
├── run-sql-scripts.ts          # TypeScript脚本执行工具（MySQL）
├── init-database.sh            # Bash初始化脚本（MySQL）
├── package.json                # Node.js依赖配置
└── README.md                   # 本文档

## 快速开始

### 1. 环境准备

确保系统已安装以下软件：

- Node.js (v16+)
- MySQL (v8.0+)
- npm 或 yarn
- ts-node（用于运行 TypeScript 脚本）

### 2. 配置环境变量

在项目根目录创建 `.env` 文件：

```bash
# MySQL数据库连接配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=yyc3_med
DB_USER=root
DB_PASSWORD=your_password
```

### 3. 执行初始化

#### 方法一：使用 Bash 脚本（推荐）

```bash
# 基本初始化
./init-database.sh

# 创建数据库并初始化
./init-database.sh --create-db

# 跳过初始数据插入
./init-database.sh --skip-data

# 备份现有数据后初始化
./init-database.sh --backup --force
```

#### 方法二：使用 Node.js 脚本

```bash
# 安装依赖
npm install

# 执行初始化
npm run init

# 创建数据库
npm run init:create-db

# 跳过数据插入
npm run init:schema-only
```

## 脚本命令（package.json）

| 命令 | 描述 |
|------|------|
| `db:init` | 执行完整初始化 |
| `db:init:create` | 创建数据库并初始化 |
| `db:init:schema` | 仅创建表结构，跳过数据 |
| `db:backup` | 执行数据库备份 |
| `db:maintenance` | 执行维护存储过程 |
| `db:health-check` | 执行数据库健康检查 |
| `db:install-deps` | 安装数据库脚本依赖 |

## 数据库结构

### 核心业务表

| 表名 | 描述 |
|------|------|
| `users` | 用户信息 |
| `patients` | 患者信息 |
| `medical_records` | 医疗记录 |
| `ai_diagnosis_records` | AI诊断记录 |
| `medical_images` | 医疗图像 |
| `certifications` | 认证证书 |
| `medications` | 药物信息 |
| `prescriptions` | 处方信息 |
| `appointments` | 预约信息 |
| `research_projects` | 研究项目 |
| `research_data` | 研究数据 |

### 系统表

| 表名 | 描述 |
|------|------|
| `system_logs` | 系统操作日志 |
| `notifications` | 用户通知 |
| `system_settings` | 系统配置 |
| `maintenance_tasks` | 维护任务记录 |

## 维护存储过程（MySQL）

```sql
CALL cleanup_old_data();
CALL optimize_database_performance();
CALL check_patient_data_integrity();
CALL get_ai_diagnosis_statistics();
CALL get_user_activity_statistics(30);
CALL database_health_check();
CALL export_patient_data('patient-uuid-here');
```

## 常用操作

### 清空数据库数据

```bash
mysql -u root -p yyc3_med < reset-database.sql
```

### 插入测试数据

```bash
mysql -u root -p yyc3_med < test-data.sql
```

### 验证数据库结构一致性

```bash
ts-node verify-schema.ts
```

### 创建备份

```bash
mysqldump -u root -p yyc3_med > backup_$(date +%Y%m%d).sql
```

### 恢复备份

```bash
mysql -u root -p yyc3_med < backup_20240115.sql
```

## 故障排除

- **连接失败**：确认 MySQL 服务已启动，端口正确，用户密码无误
- **权限不足**：使用具有权限的用户执行
- **表已存在**：使用 `--force` 或手动清理旧表
- **依赖缺失**：运行 `npm install` 或安装 `ts-node`

## 安全建议

- 使用强密码
- 限制数据库访问IP
- 为不同角色设置最小权限
- 定期审查用户权限

## 联系支持

- 技术支持：<admin@0379.email>
- 开发团队：<admin@0379.email>
- 文档反馈：<admin@0379.email>

---

**言语云³医疗AI系统** - 让AI赋能医疗，让健康触手可及

- ✅ MySQL 数据库服务
- ✅ Adminer（轻量级数据库管理工具）
- ✅ 可选：初始化脚本挂载支持

---

## ✅ 完整版 `docker-compose.yml`（适用于 `scripts/database/`）

version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: yyc3-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: your_password
      MYSQL_DATABASE: yyc3_med
      MYSQL_USER: yyc3_user
      MYSQL_PASSWORD: your_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./scripts/database/init:/docker-entrypoint-initdb.d
    command: --default-authentication-plugin=mysql_native_password

  adminer:
    image: adminer
    container_name: yyc3-adminer
    restart: always
    ports:
      - "5151:8080"
    environment:
      ADMINER_DEFAULT_SERVER: mysql

volumes:
  mysql_data:

---

## ✅ 使用说明

### 启动服务

docker-compose up -d

### 访问 Adminer

浏览器打开：`http://localhost:5151`

- 系统：MySQL
- 服务器：mysql
- 用户名：root 或 yyc3_user
- 密码：your_password
- 数据库：yyc3_med

### 初始化脚本自动执行

将以下文件放入 `scripts/database/init/` 目录中：

- `create-tables.sql`
- `insert-initial-data.sql`
- `maintenance-procedures.sql`

它们将在容器首次启动时自动执行。

---

## ✅ 推荐 `.env` 配置（与 Docker 保持一致）

DB_HOST=localhost
DB_PORT=3306
DB_NAME=yyc3_med
DB_USER=yyc3_admin
DB_PASSWORD=your_password

---
