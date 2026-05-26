'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, X } from 'lucide-react'

const TOUR_STORAGE_KEY = 'teampoint:new-user-project-tour:v1'

type TourStep = {
  selector: string
  title: string
  body: string
}

type TourRect = {
  top: number
  left: number
  width: number
  height: number
}

const steps: TourStep[] = [
  {
    selector: '[data-tour="sample-project-card"]',
    title: 'Explore the sample project',
    body: 'This starter project has sample tasks, members, discussions, and a document so you can learn the flow quickly.',
  },
  {
    selector: '[data-tour="new-project-button"]',
    title: 'Create your real project',
    body: 'When you are ready, use New Project to add your own work. You can invite teammates now or later.',
  },
  {
    selector: '[data-tour="sidebar-my-tasks"]',
    title: 'Jump around your workspace',
    body: 'Use the sidebar to move between tasks, meetings, members, projects, and feedback without losing context.',
  },
]

function getTargetRect(selector: string): TourRect | null {
  const target = document.querySelector<HTMLElement>(selector)

  if (!target) return null

  const rect = target.getBoundingClientRect()

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  }
}

function getCardPosition(rect: TourRect) {
  const gap = 14
  const width = 320
  const paddedLeft = Math.min(
    Math.max(16, rect.left + rect.width / 2 - width / 2),
    window.innerWidth - width - 16,
  )
  const belowTop = rect.top + rect.height + gap
  const aboveTop = rect.top - 190

  return {
    left: paddedLeft,
    top: belowTop + 180 < window.innerHeight ? belowTop : Math.max(16, aboveTop),
  }
}

export default function ProjectsTour({ enabled }: { enabled: boolean }) {
  const [active, setActive] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [targetRect, setTargetRect] = useState<TourRect | null>(null)

  const currentStep = steps[stepIndex]

  const cardPosition = useMemo(() => {
    if (!targetRect) return { top: 80, left: 16 }
    return getCardPosition(targetRect)
  }, [targetRect])

  useEffect(() => {
    if (!enabled) return
    if (window.localStorage.getItem(TOUR_STORAGE_KEY)) return

    const timer = window.setTimeout(() => setActive(true), 600)
    return () => window.clearTimeout(timer)
  }, [enabled])

  useEffect(() => {
    if (!active || !currentStep) return

    const target = document.querySelector<HTMLElement>(currentStep.selector)

    if (!target) {
      const timer = window.setTimeout(() => setTargetRect(null), 0)
      return () => window.clearTimeout(timer)
    }

    function updateTarget() {
      setTargetRect(getTargetRect(currentStep.selector))
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    updateTarget()
    const timer = window.setTimeout(updateTarget, 220)

    window.addEventListener('resize', updateTarget)
    window.addEventListener('scroll', updateTarget, true)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', updateTarget)
      window.removeEventListener('scroll', updateTarget, true)
    }
  }, [active, currentStep])

  function closeTour() {
    window.localStorage.setItem(TOUR_STORAGE_KEY, 'done')
    setActive(false)
  }

  function nextStep() {
    if (stepIndex >= steps.length - 1) {
      closeTour()
      return
    }

    setStepIndex(index => index + 1)
  }

  if (!enabled || !active || !currentStep) return null

  return (
    <div className="fixed inset-0 z-[150] pointer-events-none">
      {targetRect && (
        <div
          className="absolute rounded-2xl border border-primary/80 transition-all duration-200"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow:
              '0 0 0 9999px oklch(0 0 0 / 0.68), 0 0 32px oklch(0.6 0.16 262 / 0.45)',
          }}
        />
      )}

      {!targetRect && <div className="absolute inset-0 bg-background/70" />}

      <div
        className="pointer-events-auto absolute w-80 rounded-2xl border border-border bg-card p-4
          shadow-[0_24px_80px_oklch(0_0_0/0.55)]"
        style={{ top: cardPosition.top, left: cardPosition.left }}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase text-primary">
              Step {stepIndex + 1} of {steps.length}
            </p>
            <h2 className="mt-1 text-sm font-semibold text-foreground">
              {currentStep.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeTour}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground
              transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Skip tour"
          >
            <X size={14} />
          </button>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          {currentStep.body}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={closeTour}
            className="rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground
              transition-colors hover:bg-accent hover:text-foreground"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold
              text-primary-foreground transition-opacity hover:opacity-90"
          >
            {stepIndex === steps.length - 1 ? (
              <>
                Finish <Check size={13} />
              </>
            ) : (
              <>
                Next <ArrowRight size={13} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
