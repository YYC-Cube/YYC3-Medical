# YYC³-Med 数据库审查保障系统

---

## 一、系统架构与功能模块

- 自动化数据库结构审查（TypeORM 实体与真实数据库对比）
- 迁移脚本自动生成与预览
- 数据库结构文档导出（DBML、PDF、CSV）
- 审查报告签名链与可信性校验（SHA256+RSA）
- 历史记录归档与检索
- 数据清理与归档策略
- TOS 文件中心集成（在线展示、下载、校验）
- Web UI 控制台（可选，支持协作、可视化、权限管理）

---

## 二、核心 TypeORM 实体类

### AuditReport（审查记录）

```typescript
@Entity('audit_reports')
export class AuditReport {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  timestamp: Date;
  @Column() entity_name: string;
  @Column() table_name: string;
  @Column() column_name: string;
  @Column() entity_type: string;
  @Column() db_type: string;
  @Column({ type: 'enum', enum: ['一致', '不一致', '表缺失', '字段缺失'] }) status: string;
  @Column({ nullable: true, type: 'text' }) notes: string;
  @Column({ nullable: true }) report_version: string;
  @Column({ nullable: true }) commit_hash: string;
  @Column({ nullable: true }) ci_run_id: string;
}
```

### CiAuditStatus（CI审查状态）

```typescript
@Entity('ci_audit_status')
export class CiAuditStatus {
  @PrimaryGeneratedColumn()
  id: number;
  @Column() ci_run_id: string;
  @Column() commit_hash: string;
  @CreateDateColumn() timestamp: Date;
  @Column() passed: boolean;
  @Column({ type: 'text', nullable: true }) summary: string;
  @Column({ nullable: true }) auditor: string;
}
```

### ReportSignature（报告签名链）

```typescript
@Entity('report_signatures')
export class ReportSignature {
  @PrimaryGeneratedColumn()
  id: number;
  @Column() filename: string;
  @Column() sha256_hash: string;
  @Column({ type: 'text' }) rsa_signature: string;
  @Column({ nullable: true }) commit_hash: string;
  @Column({ nullable: true }) ci_run_id: string;
  @CreateDateColumn() timestamp: Date;
  @Column({ nullable: true }) auditor: string;
}
```

### ReportArchiveIndex（归档索引）

```typescript
@Entity('report_archive_index')
export class ReportArchiveIndex {
  @PrimaryGeneratedColumn()
  id: number;
  @Column() filename: string;
  @Column() version: string;
  @Column() commit_hash: string;
  @Column() ci_run_id: string;
  @CreateDateColumn() timestamp: Date;
  @Column() auditor: string;
  @Column() verified: boolean;
  @Column({ default: 0 }) download_count: number;
}
```

---

## 三、自动化脚本与API

---

## API 设计与接口文档

## 1. /api/audit-schema

### 返回结构

```json
{
  "entities": [
    {
      "name": "AuditReport",
      "columns": [
        { "name": "id", "type": "int", "primary": true },
        { "name": "created_at", "type": "datetime" }
      ]
    }
  ],
  "dbSchema": [
    {
      "name": "audit_report",
      "columns": [
        { "name": "id", "type": "int", "primary": true },
        { "name": "created_at", "type": "datetime" }
      ]
    }
  ],
  "diff": [
    {
      "type": "missing_column",
      "table": "audit_report",
      "column": "created_at"
    }
  ]
}
```

字段说明：

- entities: TypeORM 实体结构数组
- dbSchema: 数据库真实结构数组
- diff: 差异列表（type: 差异类型, table: 表名, column: 列名）

前端调用示例：

```typescript
const res = await fetch('/api/audit-schema');
const data = await res.json();
console.log(data.diff);
```

---

## 2. /api/generate-migration

## 返回结构示例

```json
{
  "upSql": "ALTER TABLE audit_report ADD COLUMN created_at DATETIME;",
  "downSql": "ALTER TABLE audit_report DROP COLUMN created_at;",
  "diff": [
    { "type": "add_column", "table": "audit_report", "column": "created_at" }
  ]
}
```

字段说明：

- upSql: 升级 SQL 语句
- downSql: 回滚 SQL 语句
- diff: 结构变更列表（type: 变更类型, table: 表名, column: 列名）

前端调用示例：

```typescript
const res = await fetch('/api/generate-migration');
const data = await res.json();
console.log(data.upSql);
```

---

## 3. /api/generate-dbml

### 返回示例结构

```json
{
  "dbml": "Table audit_report {\n  id int [pk]\n  created_at datetime\n}",
  "tables": [
    {
      "name": "audit_report",
      "columns": [
        { "name": "id", "type": "int", "primary": true },
        { "name": "created_at", "type": "datetime" }
      ]
    }
  ]
}
```

字段说明：

- dbml: DBML 格式字符串
- tables: 表结构数组

前端调用示例：

```typescript
const res = await fetch('/api/generate-dbml');
const data = await res.json();
console.log(data.dbml);
```

---

## 4. /api/route-check

### 返回示例

```json
{
  "conflicts": ["/dashboard", "/dashboard/index"],
  "missing404": ["/admin"]
}
```

字段说明：

- conflicts: 路由冲突路径数组
- missing404: 缺失 404 页面路径数组

前端调用示例：

```typescript
const res = await fetch('/api/route-check');
const data = await res.json();
if (data.conflicts.length > 0) {
  alert('路由冲突: ' + data.conflicts.join(','));
}
```

### 1. 审查与归档

- `/api/audit-schema.ts`：实体与数据库结构对比
  - 参数：无，GET 返回结构差异 JSON
- `scripts/archive-report.ts`：自动生成 PDF/CSV/签名链，写入归档索引
  - 参数：环境变量 VERSION、GIT_COMMIT、CI_RUN_ID

### 2. 数据清理

- `scripts/cleanup-old-records.ts`：定期清理过期/无效数据
  - 参数：无，自动按时间和状态清理

### 3. 签名链生成与校验

- `scripts/generate-meta.ts` / `scripts/generate-report-signature-chain.ts`：自动生成 .meta.json
  - 参数：报告文件名、commit_hash、ci_run_id、auditor
- `/api/verify-report.ts` / `/api/report-signature.ts`：签名链校验API
  - 参数：filename，GET 返回签名链元数据及校验结果

### 4. 归档与展示

- `/api/archive-list.ts` / `/api/tos-report-list.ts`：归档/报告列表API
  - 参数：无，GET 返回归档/报告列表 JSON
- `ReportList.tsx` / `ArchiveList.tsx`：前端展示组件
  - 参数：无，自动拉取 API 数据
- `SecureDownload.tsx`：下载并校验组件
  - 参数：filename，自动校验签名链
- `scripts/generate-meta.ts` / `scripts/generate-report-signature-chain.ts`：自动生成 .meta.json
- `/api/verify-report.ts` / `/api/report-signature.ts`：签名链校验API

### 4. 归档展示

- `/api/archive-list.ts` / `/api/tos-report-list.ts`：归档/报告列表API
- `ReportList.tsx` / `ArchiveList.tsx`：前端展示组件
- `SecureDownload.tsx`：下载并校验组件

---

## 四、数据清理与归档策略

|表名|清理周期|清理条件|操作方式|
|-|-|-|-|
|audit_reports|每月|超6个月且“一致”|删除或归档|
|ci_audit_status|每季度|超1年|删除|
|report_signatures|每季度|超1年且未下载|删除或归档|

- 归档文件结构：PDF、CSV、.meta.json、.sig
- 归档索引表：report_archive_index，支持检索、统计、可信性展示

---

## 五、TOS 文件中心集成

- 在线展示审查报告、签名状态、归档列表
- 支持下载、校验、筛选、详情页
- 签名链元数据与报告一同归档，保障端到端可信性

---

## 六、Web UI 控制台（可选）

- 实时审查结果、历史归档、签名链、对比差异、下载报告
- 支持团队协作、权限管理、移动端访问

---

## 七、自动化与部署方案

---

## 八、部署与运维脚本示例

### 1. 环境变量配置

```env
DATABASE_URL=mysql://user:pass@host:3306/dbname
TOS_ACCESS_KEY=xxx
TOS_SECRET_KEY=xxx
TOS_ENDPOINT=https://tos.example.com
NODE_ENV=production
PORT=3000
```

### 2. GitHub Actions 自动化审查

`.github/workflows/audit.yml` 示例：

```yaml
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 安装依赖
        run: npm install --legacy-peer-deps
      - name: 运行审查脚本
        run: node scripts/auditRoutes.js
      - name: 上传报告到 TOS
        run: node scripts/uploadToTos.js
```

### 3. Docker 部署（可选）

`Dockerfile` 示例：

```Dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
ENV NODE_ENV=production
ENV PORT=3000
CMD ["npm", "run", "start"]
```

如需详细接口参数、代码示例或运维脚本，可随时补充完善。
