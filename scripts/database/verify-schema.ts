import mysql from "mysql2/promise"
import * as dotenv from "dotenv"
dotenv.config()

const expectedTables = [
  "users", "patients", "medical_records", "ai_diagnosis_records", "medical_images",
  "certifications", "medications", "prescriptions", "appointments",
  "research_projects", "research_data", "system_logs", "notifications",
  "system_settings", "maintenance_tasks"
]

async function verifySchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "yyc3_med",
  })

  const [rows] = await connection.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = ?`,
    [process.env.DB_NAME || "yyc3_med"]
  )

  const actualTables = (rows as any[]).map((r) => r.table_name)
  const missing = expectedTables.filter((t) => !actualTables.includes(t))
  const extra = actualTables.filter((t) => !expectedTables.includes(t))

  console.log("✅ 数据库结构核对结果")
  console.log("预期表数量:", expectedTables.length)
  console.log("实际表数量:", actualTables.length)

  if (missing.length > 0) {
    console.log("❌ 缺失表:", missing.join(", "))
  } else {
    console.log("✅ 所有预期表已存在")
  }

  if (extra.length > 0) {
    console.log("⚠️ 多余表:", extra.join(", "))
  }

  await connection.end()
}

verifySchema().catch(console.error)
