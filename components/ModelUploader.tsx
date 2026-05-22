"use client"

import React from "react"

function ModelUploadResult({ result }: { result: Record<string, unknown> | null }) {
  if (!result) return null
  return (
    <div className="mt-4 p-4 border rounded">
      <h3 className="font-semibold mb-2">Upload Result</h3>
      <pre className="text-xs bg-muted p-2 rounded overflow-auto">{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}

export default function ModelUploader() {
  const [result, setResult] = React.useState<Record<string, unknown> | null>(null)
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("model", file)
    const res = await fetch("/api/upload-model", { method: "POST", body: formData })
    const data = await res.json()
    setResult(data.evaluation)
    alert(data.message)
  }
  return (
    <div>
      <input type="file" accept=".pt,.onnx,.json" onChange={handleUpload} />
      <ModelUploadResult result={result} />
    </div>
  )
}
