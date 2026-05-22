export function generateStaticParams() {
  return [{ id: 'placeholder' }]
}

export default function CaseDetailPage() {
  return (
    <div className="container py-6">
      <p className="text-center text-gray-500 py-12">病例详情加载中...</p>
    </div>
  )
}
