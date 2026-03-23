import { redirect } from 'next/navigation'
import PersonalSettingsPage from '@/components/settings/personal/page'
import WorkspaceSettingsPage from '@/components/settings/workspace/page'

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string; tab: string }>
}) {
  const { workspaceId, tab } = await params

  if (tab === 'personal') return <PersonalSettingsPage />
  if (tab === 'workspace') return <WorkspaceSettingsPage />

  redirect(`/workspace/${workspaceId}/settings/personal`)
}
