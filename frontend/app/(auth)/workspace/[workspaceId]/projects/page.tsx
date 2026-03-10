import ProjectsPage from '@/components/projects/projectpage'

export const metadata = { title: 'Projects' }

export default function Page({ params }: { params: { workspaceId: string } }) {
  return <ProjectsPage workspaceId={params.workspaceId} />
}
