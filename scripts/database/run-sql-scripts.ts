#!/usr/bin/env node

import { readFileSync, existsSync } from "fs"
import { join, resolve } from "path"
import * as dotenv from "dotenv"
import mysql from "mysql2/promise"

dotenv.config()

interface DatabaseConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
}

interface ScriptResult {
  filename: string
  success: boolean
  duration: number
  error?: string
  rowsAffected?: number
}

class MySQLScriptRunner {
  private config: DatabaseConfig
  private connection!: mysql.Connection

  constructor(config: DatabaseConfig) {
    this.config = config
  }

  async connect(): Promise<void> {
    try {
      this.connection = await mysql.createConnection({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
        multipleStatements: true,
      })
      console.log("✅ 数据库连接成功")
    } catch (error) {
      console.error("❌ 数据库连接失败:", error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end()
      console.log("✅ 数据库连接已关闭")
    }
  }

  async executeScript(scriptPath: string): Promise<ScriptResult> {
    const filename = scriptPath.split("/").pop() || scriptPath
    const startTime = Date.now()

    try {
      console.log(`🚀 开始执行脚本: ${filename}`)

      if (!existsSync(scriptPath)) {
        throw new Error(`脚本文件不存在: ${scriptPath}`)
      }

      const sqlContent = readFileSync(scriptPath, "utf-8")
      const statements = sqlContent
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

      let totalRowsAffected = 0

      for (const statement of statements) {
        const [result] = await this.connection.execute(statement)
        if ("affectedRows" in result) {
          totalRowsAffected += result.affectedRows
        }
      }

      const duration = Date.now() - startTime
      console.log(`✅ 脚本执行成功: ${filename} (${duration}ms, 影响行数: ${totalRowsAffected})`)

      return {
        filename,
        success: true,
        duration,
        rowsAffected: totalRowsAffected,
      }
    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : String(error)

      console.error(`❌ 脚本执行失败: ${filename} (${duration}ms)`)
      console.error(`   错误信息: ${errorMessage}`)

      return {
        filename,
        success: false,
        duration,
        error: errorMessage,
      }
    }
  }

  async getTables(): Promise<string[]> {
    const [rows] = await this.connection.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = ?`,
      [this.config.database],
    )
    return (rows as any[]).map((row) => row.table_name)
  }

  async getTableRowCount(tableName: string): Promise<number> {
    const [rows] = await this.connection.query(`SELECT COUNT(*) AS count FROM \`${tableName}\``)
    return Number((rows as any[])[0].count)
  }

  generateReport(results: ScriptResult[]): void {
    console.log("\n📊 执行报告")
    console.log("=".repeat(50))

    const successful = results.filter((r) => r.success)
    const failed = results.filter((r) => !r.success)

    console.log(`✅ 成功: ${successful.length} 个脚本`)
    console.log(`❌ 失败: ${failed.length} 个脚本`)

    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)
    console.log(`⏱️  总耗时: ${totalDuration}ms`)

    const totalRowsAffected = results.reduce((sum, r) => sum + (r.rowsAffected || 0), 0)
    console.log(`📈 总影响行数: ${totalRowsAffected}`)

    if (failed.length > 0) {
      console.log("\n❌ 失败的脚本:")
      failed.forEach((result) => {
        console.log(`   - ${result.filename}: ${result.error}`)
      })
    }

    console.log("=".repeat(50))
  }
}

async function main() {
  console.log("🏥 言语云³医疗AI系统 - MySQL数据库初始化工具")
  console.log("=".repeat(60))

  const config: DatabaseConfig = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || "3306"),
    database: process.env.DB_NAME || "yyc3_med",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
  }

  console.log(`🔗 连接配置: ${config.user}@${config.host}:${config.port}/${config.database}`)

  const runner = new MySQLScriptRunner(config)

  try {
    await runner.connect()

    const scriptsDir = resolve(__dirname)
    const scriptFiles = ["create-tables.sql", "insert-initial-data.sql", "maintenance-procedures.sql"]
    const existingScripts = scriptFiles.filter((file) => existsSync(join(scriptsDir, file)))

    if (existingScripts.length === 0) {
      console.log("⚠️  未找到SQL脚本文件")
      return
    }

    const scriptPaths = existingScripts.map((file) => join(scriptsDir, file))
    const results = []

    for (const path of scriptPaths) {
      const result = await runner.executeScript(path)
      results.push(result)
    }

    runner.generateReport(results)

    console.log("\n📊 数据库状态:")
    const tables = await runner.getTables()
    console.log(`📋 表数量: ${tables.length}`)

    for (const table of tables.slice(0, 10)) {
      const count = await runner.getTableRowCount(table)
      console.log(`   - ${table}: ${count} 行`)
    }

    if (tables.length > 10) {
      console.log(`   ... 还有 ${tables.length - 10} 个表`)
    }
  } catch (error) {
    console.error("❌ 执行失败:", error)
    process.exit(1)
  } finally {
    await runner.disconnect()
  }
}

main()run-sql-scripts.ts

/**
 * 命令行参数处理
 */
function parseArguments() {
  const args = process.argv.slice(2)
  return {
    help: args.includes("--help") || args.includes("-h"),
    createDb: args.includes("--create-db"),
    skipData: args.includes("--skip-data"),
    force: args.includes("--force"),
  }
}

/**
 * 显示帮助信息
 */
 function showHelp() {
  console.log(`
🏥 言语云³医疗AI系统 - MySQL数据库脚本执行工具

用法: node run-sql-scripts.ts [选项]

选项:
  -h, --help        显示帮助信息
  --create-db       如果数据库不存在则创建
  --skip-data       跳过初始数据插入
  --force           强制执行（跳过确认）

环境变量:
  DB_HOST           数据库主机 (默认: localhost)
  DB_PORT           数据库端口 (默认: 3306)
  DB_NAME           数据库名称 (默认: yyc3_med)
  DB_USER           数据库用户 (默认: root)
  DB_PASSWORD       数据库密码 (默认: password)

示例:
  npm run init
  npm run init:create-db
  npm run init:schema-only
`)
}

/**
 * 创建数据库
 */
async function createDatabaseIfNotExists(config: DatabaseConfig): Promise<void> {
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
  })

  const [rows] = await connection.query(
    `SELECT SCHEMA_NAME FROM information_schema.schemata WHERE SCHEMA_NAME = ?`,
    [config.database],
  )

  if ((rows as any[]).length === 0) {
    console.log(`🔨 创建数据库: ${config.database}`)
    await connection.query(`CREATE DATABASE \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
    console.log(`✅ 数据库创建成功`)
  } else {
    console.log(`📊 数据库已存在: ${config.database}`)
  }

  await connection.end()
}

/**
 * 主入口逻辑更新
 */
 if (require.main === module) {
  const options = parseArguments()

  if (options.help) {
    showHelp()
    process.exit(0)
  }

  const config: DatabaseConfig = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || "3306"),
    database: process.env.DB_NAME || "yyc3_med",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
  }

  ;(async () => {
    if (options.createDb) {
      await createDatabaseIfNotExists(config)
    }

    const runner = new MySQLScriptRunner(config)
    await runner.connect()

    const scriptsDir = resolve(__dirname)
    const scriptFiles = ["create-tables.sql"]
    if (!options.skipData) {
      scriptFiles.push("insert-initial-data.sql")
    }
    scriptFiles.push("maintenance-procedures.sql")

    const existingScripts = scriptFiles.filter((file) => existsSync(join(scriptsDir, file)))
    const scriptPaths = existingScripts.map((file) => join(scriptsDir, file))
    const results = await runner.executeScripts(scriptPaths)

    runner.generateReport(results)

    const tables = await runner.getTables()
    console.log(`📋 表数量: ${tables.length}`)
    for (const table of tables.slice(0, 10)) {
      const count = await runner.getTableRowCount(table)
      console.log(`   - ${table}: ${count} 行`)
    }

    await runner.disconnect()
  })().catch((error) => {
    console.error("💥 程序异常退出:", error)
    process.exit(1)
  })
}