import { useParams } from 'next/navigation'

export function useWorkspaceId(): number {
  const params = useParams()
  return Number(params.workspaceId)
}