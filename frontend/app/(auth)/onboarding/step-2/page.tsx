'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AuthBackground } from '@/components/auth'
import {
  OnboardingActions,
  OnboardingCard,
  OnboardingHeader,
  OnboardingInviteRow,
  OnboardingStepIndicator,
  type InvitedMember,
} from '@/components/onboarding'

const STEPS = [{ label: 'Workspace' }, { label: 'Invite' }, { label: 'Done' }]

export default function OnboardingStep2() {
  const router = useRouter()
  const [members, setMembers] = useState<InvitedMember[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSendInvites() {
    setLoading(true)
    // await inviteMembers(members)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)

    toast.success(`${members.length} invite${members.length > 1 ? 's' : ''} sent!`, {
      description:
        members.length === 1
          ? `We've emailed ${members[0].email}. They'll get a link to join.`
          : `We've emailed your ${members.length} teammates. They'll get a link to join.`,
      duration: 3500,
      position: 'top-right',
    })

    router.push('/onboarding/step-3')
  }

  function handleSkip() {
    router.push('/onboarding/step-3')
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[oklch(0.16_0.005_260)] p-8">
      <AuthBackground />
      <div className="relative z-10 flex w-full flex-col items-center gap-8">
        <OnboardingCard>
          <div className="flex flex-col gap-8">
            <OnboardingStepIndicator currentStep={2} steps={STEPS} />

            <OnboardingHeader
              title="Invite your teammates"
              subtitle="Set their role and start collaborating. You can always invite more people later."
            />

            <OnboardingInviteRow members={members} onChange={setMembers} />

            <OnboardingActions
              onNext={handleSendInvites}
              onBack={() => router.push('/onboarding/step-1')}
              onSkip={handleSkip}
              nextLabel={
                members.length > 0
                  ? `Send ${members.length} Invite${members.length > 1 ? 's' : ''}`
                  : 'Send Invites'
              }
              loading={loading}
              loadingLabel="Sending…"
              showBack
              showSkip
              skipLabel="Skip for now"
            />
          </div>
        </OnboardingCard>
      </div>
    </main>
  )
}
