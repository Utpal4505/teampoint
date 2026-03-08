'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Building2, Users } from 'lucide-react'
import { AuthBackground } from '@/components/auth'
import { OnboardingCard, OnboardingStepIndicator } from '@/components/onboarding'
import { useFetchWorkspaceById } from '@/features/workspace/hooks'
import { Spinner } from '@/components/ui/spinner'

const STEPS = [{ label: 'Workspace' }, { label: 'Invite' }, { label: 'Done' }]

// Animated SVG checkmark
function AnimatedCheck() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulse ring */}
      <div
        className="absolute h-24 w-24 rounded-full"
        style={{
          background: 'oklch(0.52 0.15 145 / 0.08)',
          animation: 'check-pulse 2s ease-in-out infinite',
        }}
      />
      {/* Inner ring */}
      <div
        className="absolute h-16 w-16 rounded-full"
        style={{
          background: 'oklch(0.52 0.15 145 / 0.12)',
          animation: 'check-pulse 2s ease-in-out 0.3s infinite',
        }}
      />
      {/* Circle + check */}
      <div
        className="relative flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: 'oklch(0.52 0.15 145)' }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          className="overflow-visible"
        >
          <path
            d="M6 14l6 6L22 8"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 28,
              strokeDashoffset: 28,
              animation: 'check-draw 0.5s cubic-bezier(0.4,0,0.2,1) 0.2s forwards',
            }}
          />
        </svg>
      </div>

      <style>{`
        @keyframes check-pulse {
          0%, 100% { transform: scale(1);   opacity: 1; }
          50%       { transform: scale(1.1); opacity: 0.5; }
        }
        @keyframes check-draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  )
}

export default function OnboardingStep3() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const workspaceIdParam = searchParams.get('workspaceId')
  const workspaceId = workspaceIdParam ? Number(workspaceIdParam) : undefined

  const { data: workspace, isLoading } = useFetchWorkspaceById(workspaceId)

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  function goToDashboard() {
    if (!workspaceId) return
    router.push(`/workspace/${workspaceId}/dashboard`)
  }

  useEffect(() => {
    if (!workspace && !isLoading) {
      router.replace('/onboarding/step-1')
    }
  }, [workspace, isLoading, router])

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )

  const workspaceName = workspace?.name ?? ''
  const memberCount = workspace?.workspaceMembers.length ?? 0

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[oklch(0.16_0.005_260)] p-8">
      <AuthBackground />

      <div
        className="relative z-10 flex w-full flex-col items-center gap-8 transition-all duration-500"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
        }}
      >
        <OnboardingCard>
          <div className="flex flex-col items-center gap-8 text-center">
            {/* Step indicator — Done is green */}
            <div className="w-full">
              <OnboardingStepIndicator currentStep={3} steps={STEPS} />
            </div>

            {/* Animated checkmark */}
            <AnimatedCheck />

            {/* Heading */}
            <div className="flex flex-col gap-2">
              <h1 className="font-[family-name:var(--display-family)] text-2xl font-bold tracking-tight text-[oklch(0.92_0_0)]">
                Your workspace is ready
              </h1>
              <p className="font-[family-name:var(--body-family)] text-sm leading-relaxed text-[oklch(0.52_0_0)]">
                Everything is set up and waiting for you.
              </p>
            </div>

            {/* Workspace summary card */}
            <div className="w-full rounded-xl border border-[oklch(0.27_0.01_250)] bg-[oklch(0.18_0.01_250)] px-6 py-4">
              <div className="flex items-center gap-4">
                {/* Workspace icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.6_0.16_262/0.15)]">
                  <Building2 size={18} className="text-[oklch(0.6_0.16_262)]" />
                </div>

                <div className="flex flex-col items-start gap-[2px] min-w-0">
                  <span className="font-[family-name:var(--body-family)] text-sm font-medium text-[oklch(0.88_0_0)] truncate">
                    {workspaceName}
                  </span>
                  <span className="font-[family-name:var(--body-family)] text-xs text-[oklch(0.45_0_0)]">
                    Created just now
                  </span>
                </div>

                {memberCount > 0 && (
                  <div className="ml-auto flex items-center gap-2 shrink-0">
                    <Users size={13} className="text-[oklch(0.42_0_0)]" />
                    <span className="font-[family-name:var(--body-family)] text-xs text-[oklch(0.48_0_0)]">
                      {memberCount} invited
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={goToDashboard}
              className="flex w-full items-center justify-center gap-2 rounded-xl
                bg-[oklch(0.6_0.16_262)] px-6 py-4
                font-[family-name:var(--body-family)] text-sm font-medium
                text-[oklch(0.98_0_0)]
                shadow-[0_2px_16px_oklch(0.6_0.16_262/0.25)]
                transition-all duration-150
                hover:-translate-y-px hover:bg-[oklch(0.56_0.16_262)]
                hover:shadow-[0_6px_24px_oklch(0.6_0.16_262/0.4)]
                active:translate-y-0 active:scale-[0.99]
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-[oklch(0.6_0.16_262)]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[oklch(0.2_0.01_250)]"
            >
              Go to Dashboard
              <ArrowRight size={15} />
            </button>

            {/* Footer hint */}
            <p className="font-[family-name:var(--body-family)] text-xs text-[oklch(0.38_0_0)]">
              Invite more teammates from Settings anytime
            </p>
          </div>
        </OnboardingCard>
      </div>
    </main>
  )
}
