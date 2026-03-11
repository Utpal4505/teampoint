import ProjectDetailPage from '@/components/projects/detail/projectdetailpage'

export default async function Page({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>
}) {
  const { workspaceId, projectId } = await params
  return (
    <ProjectDetailPage workspaceId={Number(workspaceId)} projectId={Number(projectId)} />
  )
}
