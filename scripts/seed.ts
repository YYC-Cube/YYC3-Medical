/**
 * 数据库种子脚本 — 仅用于开发环境初始化测试数据
 *
 * 安全警告：
 *   以下密码仅为开发环境占位符，生产环境请通过环境变量注入：
 *   process.env.SEED_ADMIN_PWD / process.env.SEED_DOCTOR_PWD
 *   且必须使用 bcrypt 哈希后存储，禁止明文写入数据库。
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.create({
    data: {
      email: "admin@yanyucloud.com",
      password: process.env.SEED_ADMIN_PWD || "admin123", // 开发占位符
      role: "admin",
    },
  });

  const doctor = await prisma.user.create({
    data: {
      email: "doctor@yanyucloud.com",
      password: process.env.SEED_DOCTOR_PWD || "doctor123", // 开发占位符
      role: "doctor",
    },
  });

  const patient = await prisma.patient.create({
    data: {
      name: "张三",
      gender: "male",
      birth_date: new Date("1985-06-15"),
      contact_info: "北京市朝阳区",
      created_by: doctor.id,
    },
  });

  await prisma.medicalRecord.create({
    data: {
      patient_id: patient.id,
      diagnosis: "肺部结节，建议进一步检查",
      confidence: 92.5,
      created_by: doctor.id,
    },
  });
}

main().finally(() => prisma.$disconnect());
