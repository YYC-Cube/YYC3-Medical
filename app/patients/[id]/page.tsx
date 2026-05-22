export function generateStaticParams() {
  return [{ id: 'placeholder' }]
}

export default function PatientDetailsPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <p className="text-center text-gray-500 py-12">患者详情加载中...</p>
    </div>
  )
}
