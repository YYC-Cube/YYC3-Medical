#!/bin/bash

# 言语云³医疗AI系统 - MySQL数据库初始化脚本
# YYC³-Med Database Initialization Script (MySQL)
# 创建时间: 2024-01-15
# 版本: v1.0.0

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

show_banner() {
    echo -e "${BLUE}"
    echo "============================================================"
    echo "🏥 言语云³医疗AI系统 - MySQL数据库初始化工具"
    echo "   YYC³-Med Database Initialization Tool"
    echo "============================================================"
    echo -e "${NC}"
}

load_env() {
    log_info "加载环境变量..."
    if [ -f "../../.env" ]; then
        source ../../.env
        log_success "已加载 ../../.env 文件"
    elif [ -f ".env" ]; then
        source .env
        log_success "已加载本地 .env 文件"
    else
        log_warning "未找到 .env 文件，使用默认配置"
    fi

    export DB_HOST=${DB_HOST:-localhost}
    export DB_PORT=${DB_PORT:-3306}
    export DB_NAME=${DB_NAME:-yyc3_med}
    export DB_USER=${DB_USER:-root}
    export DB_PASSWORD=${DB_PASSWORD:-password}
    log_info "数据库配置: ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
}

test_connection() {
    log_info "测试数据库连接..."
    if command -v mysql &> /dev/null; then
        if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT VERSION();" &> /dev/null; then
            log_success "数据库连接成功"
        else
            log_error "数据库连接失败，请检查配置"
            exit 1
        fi
    else
        log_error "未安装 mysql 客户端"
        exit 1
    fi
}

create_backup() {
    if [[ "$@" =~ "--backup" ]]; then
        log_info "创建数据库备份..."
        local backup_dir="./backups"
        local backup_file="${backup_dir}/backup_$(date +%Y%m%d_%H%M%S).sql"
        mkdir -p "$backup_dir"

        if command -v mysqldump &> /dev/null; then
            if mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$backup_file"; then
                log_success "备份成功: $backup_file"
            else
                log_warning "备份失败（数据库可能不存在）"
            fi
        else
            log_warning "跳过备份（mysqldump 未安装）"
        fi
    fi
}

run_sql_scripts() {
    log_info "执行 SQL 初始化脚本..."
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < create-tables.sql
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < insert-initial-data.sql
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < maintenance-procedures.sql
    log_success "SQL 脚本执行完成"
}

verify_installation() {
    if [[ "$@" =~ "--no-verify" ]]; then
        log_info "跳过安装验证"
        return
    fi

    log_info "验证数据库安装结果..."
    local table_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -sse "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME';")
    if [ "$table_count" -gt 0 ]; then
        log_success "数据库初始化成功，共创建 $table_count 个表"
        log_info "主要表记录统计:"
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -e "
            SELECT table_name, table_rows
            FROM information_schema.tables
            WHERE table_schema = '$DB_NAME'
            ORDER BY table_rows DESC
            LIMIT 10;"
    else
        log_error "数据库初始化失败，未创建任何表"
        exit 1
    fi
}

show_help() {
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  --help          显示帮助信息"
    echo "  --create-db     如果数据库不存在则创建"
    echo "  --skip-data     跳过初始数据插入"
    echo "  --force         强制执行（跳过确认）"
    echo "  --backup        执行前创建备份"
    echo "  --no-verify     跳过安装验证"
    echo ""
    echo "环境变量:"
    echo "  DB_HOST         数据库主机 (默认: localhost)"
    echo "  DB_PORT         数据库端口 (默认: 3306)"
    echo "  DB_NAME         数据库名称 (默认: yyc3_med)"
    echo "  DB_USER         数据库用户 (默认: root)"
    echo "  DB_PASSWORD     数据库密码 (默认: password)"
}

main() {
    for arg in "$@"; do
        if [ "$arg" = "--help" ] || [ "$arg" = "-h" ]; then
            show_help
            exit 0
        fi
    done

    show_banner
    load_env
    test_connection
    create_backup "$@"
    run_sql_scripts
    verify_installation "$@"

    log_success "数据库初始化完成！"
    echo ""
    echo -e "${GREEN}🎉 YYC³-Med MySQL 数据库已准备就绪！${NC}"
    echo ""
    echo "下一步："
    echo "1. 启动应用服务器"
    echo "2. 访问管理界面进行系统配置"
    echo "3. 创建管理员账户"
    echo ""
}

trap 'log_error "脚本执行过程中发生错误，请检查日志"; exit 1' ERR
main "$@"
