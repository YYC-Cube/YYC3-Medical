export default function RouteCheck() {
  // STATIC-EXPORT-NOTE: 当前项目为静态导出，/api/route-check 不存在。
  // 接入真实后端时，在此处替换为 fetch 调用并填充 routeCheckData state。
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">路由冲突检测</h2>
      <div className="bg-white p-4 rounded shadow">待接入路由检测结果...</div>
    </div>
  );
}
