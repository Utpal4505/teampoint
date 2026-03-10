import ProjectsPage from '@/components/projects/projectpage'

export const metadata = { title: 'Projects' }

export default async function Page({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params
  return <ProjectsPage workspaceId={workspaceId} />
}