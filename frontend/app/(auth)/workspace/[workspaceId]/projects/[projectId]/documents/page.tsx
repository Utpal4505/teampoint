'use client'

import DocumentsTab from '@/components/projects/detail/tabs/document'
import { useProjectDetailContext } from '@/components/projects/detail/project-detail-context'

export default function DocumentsPage() {
  const { projectId } = useProjectDetailContext()
  return <DocumentsTab projectId={projectId} />
}