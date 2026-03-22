'use client'

import { useState } from 'react'
import { X, FolderKanban, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { StepIndicator } from './stepindicator'
import { Step1Details } from './step1details'
import { Step2Members, type AddedMember } from './step2members'
import { createProjectSchema, addProjectMemberSchema } from '@/features/projects/schemas'
import type {
  ProjectStatus,
  ProjectRole,
  CreateProjectPayload,
  ProjectMemberPayload,
  Step1Errors,
} from '@/features/projects/schemas'
import { MOCK_WORKSPACE_MEMBERS } from '@/features/projects/constants'
import { useCreateProject } from '@/features/projects/hooks'
import { createPortal } from 'react-dom'

export type { CreateProjectPayload, ProjectMemberPayload }

interface CreateProjectModalProps {
  open: boolean
  onClose: () => void
  workspaceId: string
}

export function CreateProjectModal({
  open,
  onClose,
  workspaceId,
}: CreateProjectModalProps) {
  const createProjectMutation = useCreateProject()
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<ProjectStatus>('ACTIVE')
  const [errors, setErrors] = useState<Step1Errors>({})
  const [members, setMembers] = useState<AddedMember[]>([])
  const [loading, setLoading] = useState(false)

  function validateStep1(): boolean {
    const result = createProjectSchema.safeParse({
      workspaceId: Number(workspaceId),
      name: name,
      description: description || undefined,
    })
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors
      setErrors({ name: flat.name?.[0], description: flat.description?.[0] })
      return false
    }
    setErrors({})
    return true
  }

  function addMember(m: (typeof MOCK_WORKSPACE_MEMBERS)[number]) {
    if (members.find(x => x.userId === m.userId)) return
    setMembers(p => [...p, { ...m, role: 'MEMBER' as const }])
  }

  function removeMember(userId: string) {
    setMembers(p => p.filter(m => m.userId !== userId))
  }

  function updateRole(userId: string, role: ProjectRole) {
    if (role === 'OWNER') return
    setMembers(p =>
      p.map(m =>
        m.userId === userId ? { ...m, role: role as Exclude<ProjectRole, 'OWNER'> } : m,
      ),
    )
  }

  function reset() {
    setStep(1)
    setName('')
    setDescription('')
    setStatus('ACTIVE')
    setErrors({})
    setMembers([])
    setLoading(false)
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit() {
    const allValid = members.every(
      m =>
        addProjectMemberSchema.safeParse({ userId: Number(m.userId), role: m.role })
          .success,
    )
    if (!allValid) return

    setLoading(true)
    try {
      const projectPayload = {
        workspaceId: Number(workspaceId),
        name: name.trim(),
        description: description.trim() || undefined,
      }
      await createProjectMutation.mutateAsync(projectPayload)
      handleClose()
    } catch (error) {
      console.error('Failed to create project:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-200 flex items-center justify-center p-4"
      style={{ background: 'oklch(0 0 0 / 0.7)' }}
      onMouseDown={e => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div
        className="relative w-full max-w-110 rounded-2xl border border-border bg-card
        shadow-[0_32px_80px_oklch(0_0_0/0.7)]
        animate-in fade-in-0 zoom-in-95 duration-200"
      >
        <div className="overflow-hidden rounded-t-2xl">
          <div
            className="h-0.5 w-full"
            style={{
              background:
                'linear-gradient(90deg,transparent 10%,oklch(0.6 0.16 262/0.7) 50%,transparent 90%)',
            }}
          />
        </div>

        <div className="flex items-start justify-between px-6 pt-5 pb-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl
                bg-primary/10 ring-1 ring-primary/20"
              >
                <FolderKanban size={16} className="text-primary" />
              </div>
              <div>
                <h2 className="font-display text-[15px] font-bold text-foreground">
                  New Project
                </h2>
                <p className="font-sans text-[11px] text-muted-foreground">
                  {step === 1 ? 'Configure your project' : 'Add team members'}
                </p>
              </div>
            </div>
            <StepIndicator step={step} />
          </div>

          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg
              border border-transparent text-muted-foreground transition-all duration-150
              hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        <div className="h-px mx-6 bg-border" />

        {step === 1 && (
          <Step1Details
            name={name}
            description={description}
            status={status}
            errors={errors}
            onNameChange={v => {
              setName(v)
              if (errors.name) setErrors(p => ({ ...p, name: undefined }))
            }}
            onDescriptionChange={v => {
              setDescription(v)
              if (errors.description) setErrors(p => ({ ...p, description: undefined }))
            }}
            onStatusChange={setStatus}
          />
        )}

        {step === 2 && (
          <Step2Members
            members={members}
            onAdd={addMember}
            onRemove={removeMember}
            onRoleChange={updateRole}
          />
        )}

        <div className="flex items-center gap-2.5 border-t border-border px-6 py-4">
          {step === 1 ? (
            <>
              <button
                onClick={handleClose}
                className="flex-1 rounded-xl border border-border bg-background
                  px-4 py-2.5 font-sans text-sm text-muted-foreground
                  transition-all duration-150 hover:bg-accent hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (validateStep1()) setStep(2)
                }}
                className="flex flex-2 items-center justify-center gap-2 rounded-xl
                  bg-primary px-4 py-2.5 font-sans text-sm font-medium text-primary-foreground
                  shadow-[0_2px_12px_oklch(0.6_0.16_262/0.3)] transition-all duration-150
                  hover:-translate-y-px active:translate-y-0"
              >
                Continue <ArrowRight size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 rounded-xl border border-border bg-background
                  px-4 py-2.5 font-sans text-sm text-muted-foreground
                  transition-all duration-150 hover:bg-accent hover:text-foreground"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl
                  bg-primary px-4 py-2.5 font-sans text-sm font-medium text-primary-foreground
                  shadow-[0_2px_12px_oklch(0.6_0.16_262/0.3)] transition-all duration-150
                  hover:-translate-y-px active:translate-y-0
                  disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <FolderKanban size={14} /> Create Project
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
