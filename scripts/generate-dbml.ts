import { AppDataSource } from '@/lib/db';
import fs from 'fs';
import path from 'path';

async function generateDBML() {
  const connection = await AppDataSource.initialize();
  const queryRunner = connection.createQueryRunner();
  const tables = await queryRunner.getTables();

  let dbml = `Project YYC3_Medical {\n  database_type: "MySQL"\n  note: "医疗 AI 系统数据库结构"\n}\n\n`;

  for (const table of tables) {
    dbml += `Table ${table.name} {\n`;
    for (const column of table.columns) {
      const pk = column.isPrimary ? ' [pk]' : '';
      const type = column.type.toUpperCase();
      dbml += `  ${column.name} ${type}${pk}\n`;
    }
    dbml += `}\n\n`;
  }

  const outputPath = path.join(process.cwd(), 'schema.dbml');
  fs.writeFileSync(outputPath, dbml);
  console.log(`✅ schema.dbml 已生成: ${outputPath}`);

  await queryRunner.release();
  await connection.destroy();
}

generateDBML();
