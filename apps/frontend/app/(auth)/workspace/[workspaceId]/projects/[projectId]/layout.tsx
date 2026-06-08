import ProjectLayoutShell from '@/components/projects/detail/project-detail-layout-shell'

export default async function ProjectDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ workspaceId: string; projectId: string }>
}) {
  const { workspaceId, projectId } = await params
  return (
    <ProjectLayoutShell workspaceId={Number(workspaceId)} projectId={Number(projectId)}>
      {children}
    </ProjectLayoutShell>
  )
}