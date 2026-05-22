"use client"

import { useRouter } from "next/navigation"
import { CaseDetail } from "@/components/case-library/case-detail"
import { PageTransition } from "@/components/ui/page-transition"

export function CaseDetailClient({ caseId }: { caseId: string }) {
  const router = useRouter()

  const handleBackToList = () => {
    router.push("/case-library")
  }

  const handleNodeClick = (nodeId: string) => {
    router.push(`/knowledge-graph?focusNode=${nodeId}`)
  }

  return (
    <PageTransition>
      <div className="container py-6">
        <CaseDetail caseId={caseId} onBack={handleBackToList} onNodeClick={handleNodeClick} />
      </div>
    </PageTransition>
  )
}
