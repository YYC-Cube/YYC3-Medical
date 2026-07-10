export default function MigrationStatus() {
  // STATIC-EXPORT-NOTE: 当前项目为静态导出，/api/generate-migration 不存在。
  // 接入真实后端时，在此处替换为 fetch 调用并填充 migrationData state。
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">迁移脚本生成状态</h2>
      <div className="bg-white p-4 rounded shadow">待接入迁移状态...</div>
    </div>
  );
}
