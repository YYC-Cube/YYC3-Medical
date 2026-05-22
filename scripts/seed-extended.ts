import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 批量生成模型版本
  await prisma.modelVariant.createMany({
    data: [
      { name: 'GPT-4-Med', version: 'v1.0.0', path: '/models/gpt4med-v1.0.0.pt', status: 'active' },
      {
        name: 'YYC³-Expert',
        version: 'v2.2.0',
        path: '/models/yyc3expert-v2.2.0.pt',
        status: 'archived',
      },
    ],
  });

  // 批量生成 A/B 测试诊断记录
  await prisma.diagnosisABTest.createMany({
    data: [
      {
        user_id: 1,
        patient_id: 1,
        model_variant: 'GPT-4-Med',
        test_group: 'A',
        result: '诊断A结果',
      },
      {
        user_id: 2,
        patient_id: 2,
        model_variant: 'YYC³-Expert',
        test_group: 'B',
        result: '诊断B结果',
      },
    ],
  });

  // 批量生成模型注册表
  await prisma.modelRegistry.createMany({
    data: [
      {
        model_name: 'GPT-4-Med',
        version: 'v1.0.0',
        path: '/models/gpt4med-v1.0.0.pt',
        status: 'active',
      },
      {
        model_name: 'YYC³-Expert',
        version: 'v2.2.0',
        path: '/models/yyc3expert-v2.2.0.pt',
        status: 'archived',
      },
    ],
  });

  // 批量生成审计日志
  await prisma.auditLog.createMany({
    data: [
      { user_id: 1, action: 'login', detail: '管理员登录' },
      { user_id: 2, action: 'diagnosis', detail: '医生完成诊断' },
    ],
  });
}

main().finally(() => prisma.$disconnect());
