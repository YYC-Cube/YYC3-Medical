import { DataSource } from 'typeorm';
import { execSync } from 'child_process';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  synchronize: false,
  logging: false,
});

async function generateMigration() {
  await dataSource.initialize();
  console.log('🔍 正在生成迁移脚本...');
  execSync('npx typeorm migration:generate src/migrations/AutoMigration -d src/lib/db.ts', {
    stdio: 'inherit',
  });
  console.log('✅ 迁移脚本已生成');
  await dataSource.destroy();
}

generateMigration();
