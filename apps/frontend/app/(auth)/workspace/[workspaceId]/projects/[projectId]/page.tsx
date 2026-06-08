import { redirect } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>
}) {
  const { workspaceId, projectId } = await params
  redirect(`/workspace/${workspaceId}/projects/${projectId}/overview`)
}