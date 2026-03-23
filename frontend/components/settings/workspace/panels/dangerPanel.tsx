'use client'

import { useState } from 'react'
import { Archive, Trash2 } from 'lucide-react'

function DangerAction({
  title,
  description,
  word,
  buttonLabel,
  Icon,
  onConfirm,
}: {
  title: string
  description: string
  word: string
  buttonLabel: string
  Icon: React.ElementType
  onConfirm: () => Promise<void>
}) {
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const canSubmit = confirm === word && !loading

  async function handle() {
    if (!canSubmit) return
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-3 py-4 border-b border-border/40 last:border-0 last:pb-0">
      <div>
        <p className="text-[13px] font-medium text-foreground">{title}</p>
        <p className="text-[12px] text-muted-foreground/50 mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>

      <p className="text-[12px] text-muted-foreground/55">
        Type <span className="font-mono text-foreground/80 font-semibold">{word}</span> to
        confirm
      </p>

      <input
        type="text"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        placeholder={word}
        className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm
          text-foreground outline-none placeholder:text-muted-foreground/25
          focus:border-border transition-colors duration-100"
      />

      <button
        onClick={handle}
        disabled={!canSubmit}
        className="flex items-center gap-2 rounded-lg border border-red-500/30
          bg-transparent px-3.5 py-2 text-xs font-semibold text-red-400 w-fit
          hover:bg-red-500/10 transition-colors duration-100
          disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Icon size={13} /> {buttonLabel}
      </button>
    </div>
  )
}

export default function WorkspaceDangerPanel() {
  return (
    <div className="px-5 py-1">
      <DangerAction
        title="Archive Workspace"
        description="Makes the workspace read-only. Members can view data but not make changes. Can be reversed later."
        word="archive"
        buttonLabel="Archive Workspace"
        Icon={Archive}
        onConfirm={async () => {
          await new Promise(r => setTimeout(r, 900))
        }}
      />
      <DangerAction
        title="Delete Workspace"
        description="Permanently deletes all projects, tasks, documents, and members. This cannot be undone."
        word="delete workspace"
        buttonLabel="Delete Workspace"
        Icon={Trash2}
        onConfirm={async () => {
          await new Promise(r => setTimeout(r, 900))
        }}
      />
    </div>
  )
}
