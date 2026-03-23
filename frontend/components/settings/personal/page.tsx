'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import SettingsSection from '@/components/settings/_components/settingsSection'
import SettingsRow from '@/components/settings/_components/settingsRow'
import ProfilePanel from './panels/profilePanel'
import IntegrationPanel from './panels/integrationPanel'
import DeactivatePanel from './panels/dangerPanel'
import SettingsModal from '../_components/settingsModal'

type ModalType = 'profile' | 'integration' | 'deactivate' | null

export default function PersonalSettingsPage() {
  const [modal, setModal] = useState<ModalType>(null)

  // TODO: replace with real user data from hook
  const userName = 'Utpal Singh'
  const integrated = true

  return (
    <>
      {/* Centered content — max-w-xl centered like Medium */}
      <div className="flex flex-col gap-7">
        {/* Account */}
        <SettingsSection
          title="Account"
          description="Manage your personal information and connected services."
        >
          <SettingsRow
            title="Profile Information"
            description="Update your name and profile photo"
            value={userName}
            onClick={() => setModal('profile')}
          />
          <SettingsRow
            title="Integrations"
            description="Manage connected tools — Google, Slack, GitHub and more"
            value={
              integrated ? (
                <span className="flex items-center gap-1 text-emerald-400 font-medium text-[12px]">
                  <CheckCircle2 size={11} /> Connected
                </span>
              ) : (
                <span className="text-[12px] text-muted-foreground/45">
                  Not connected
                </span>
              )
            }
            onClick={() => setModal('integration')}
          />
        </SettingsSection>

        {/* Security */}
        <SettingsSection
          title="Security"
          description="Control your account access and safety."
        >
          <SettingsRow
            title="Account Status"
            description="Your current account standing"
            value={
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium text-[12px]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Active
              </span>
            }
          />
        </SettingsSection>

        {/* Danger */}
        <SettingsSection
          title="Danger Zone"
          description="Permanent actions related to your account."
          danger
        >
          <SettingsRow
            title="Deactivate Account"
            description="Remove yourself from all workspaces and projects"
            onClick={() => setModal('deactivate')}
            danger
          />
        </SettingsSection>
      </div>

      {/* Modals */}
      <SettingsModal
        title="Edit Profile"
        open={modal === 'profile'}
        onClose={() => setModal(null)}
      >
        <ProfilePanel />
      </SettingsModal>

      <SettingsModal
        title="Integrations"
        open={modal === 'integration'}
        onClose={() => setModal(null)}
        size="md"
      >
        <IntegrationPanel />
      </SettingsModal>

      <SettingsModal
        title="Deactivate Account"
        open={modal === 'deactivate'}
        onClose={() => setModal(null)}
        size="sm"
      >
        <DeactivatePanel />
      </SettingsModal>
    </>
  )
}
