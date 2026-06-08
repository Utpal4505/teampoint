'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import SettingsSection from '@/components/settings/_components/settingsSection'
import SettingsRow from '@/components/settings/_components/settingsRow'
import WorkspaceGeneralPanel from './panels/generalPanel'
import WorkspaceDangerPanel from './panels/dangerPanel'
import SettingsModal from '../_components/settingsModal'
import { useFetchWorkspaceById } from '@/features/workspace/hooks'
import { Loader2 } from 'lucide-react'

type ModalType = 'general' | 'danger' | null

export default function WorkspaceSettingsPage() {
  const [modal, setModal] = useState<ModalType>(null)
  const params = useParams()
  const router = useRouter()
  const wsId = params.workspaceId as string

  const workspaceId = Number(params?.workspaceId)
  const { data: workspace, isLoading } = useFetchWorkspaceById(workspaceId)

  const wsName = workspace?.name ?? ''
  const wsDesc = workspace?.description ?? ''

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      {/* Centered content */}
      <div className="mx-auto max-w-xl w-full flex flex-col gap-8 py-2">
        {/* Workspace info */}
        <SettingsSection
          title="Workspace"
          description="Manage your workspace configuration and lifecycle."
        >
          <SettingsRow
            title="Workspace Name"
            description="Name used across your team"
            value={wsName}
            onClick={() => setModal('general')}
          />
          <SettingsRow
            title="Description"
            description="Short description for your workspace"
            value={
              wsDesc ? (
                <span className="max-w-50 truncate">{wsDesc}</span>
              ) : (
                <span className="text-muted-foreground/40 italic">Not set</span>
              )
            }
            onClick={() => setModal('general')}
          />
        </SettingsSection>

        {/* Quick access */}
        <SettingsSection
          title="Quick Access"
          description="Jump to frequently used team actions."
        >
          <SettingsRow
            title="Members"
            description="Manage your team and invite new members"
            onClick={() => router.push(`/workspace/${wsId}/members`)}
          />
        </SettingsSection>

        {/* Danger */}
        <SettingsSection
          title="Danger Zone"
          description="Irreversible workspace actions. Proceed with caution."
          danger
        >
          <SettingsRow
            title="Archive Workspace"
            description="Make workspace read-only for all members"
            onClick={() => setModal('danger')}
            danger
          />
          <SettingsRow
            title="Delete Workspace"
            description="Permanently delete all data — cannot be undone"
            onClick={() => setModal('danger')}
            danger
          />
        </SettingsSection>
      </div>

      {/* Modals */}
      <SettingsModal
        title="Workspace Settings"
        open={modal === 'general'}
        onClose={() => setModal(null)}
      >
        <WorkspaceGeneralPanel />
      </SettingsModal>

      <SettingsModal
        title="Danger Zone"
        open={modal === 'danger'}
        onClose={() => setModal(null)}
      >
        <WorkspaceDangerPanel />
      </SettingsModal>
    </>
  )
}
