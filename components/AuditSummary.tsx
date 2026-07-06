export default function AuditSummary() {
  // STATIC-EXPORT-NOTE: 当前项目为静态导出，/api/audit-schema 不存在。
  // 接入真实后端时，在此处替换为 fetch 调用并填充 auditData state。
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">实体与数据库一致性</h2>
      <div className="bg-white p-4 rounded shadow">待接入审查结果...</div>
    </div>
  );
}
