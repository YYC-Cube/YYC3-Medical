#!/bin/bash
# 自动执行 MySQL 迁移脚本
MYSQL_USER="your_user"
MYSQL_PASS="your_password"
MYSQL_DB="your_db"
MYSQL_HOST="localhost"
SQL_FILE="$(dirname "$0")/mysql_abtest_model_registry.sql"

mysql -u$MYSQL_USER -p$MYSQL_PASS -h$MYSQL_HOST $MYSQL_DB < "$SQL_FILE"
echo "数据库迁移已执行：$SQL_FILE"
