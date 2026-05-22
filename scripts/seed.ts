import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.create({
    data: {
      email: 'admin@yanyucloud.com',
      password: 'admin123',
      role: 'admin',
    },
  });

  const doctor = await prisma.user.create({
    data: {
      email: 'doctor@yanyucloud.com',
      password: 'doctor123',
      role: 'doctor',
    },
  });

  const patient = await prisma.patient.create({
    data: {
      name: '张三',
      gender: 'male',
      birth_date: new Date('1985-06-15'),
      contact_info: '北京市朝阳区',
      created_by: doctor.id,
    },
  });

  await prisma.medicalRecord.create({
    data: {
      patient_id: patient.id,
      diagnosis: '肺部结节，建议进一步检查',
      confidence: 92.5,
      created_by: doctor.id,
    },
  });
}

main().finally(() => prisma.$disconnect());
