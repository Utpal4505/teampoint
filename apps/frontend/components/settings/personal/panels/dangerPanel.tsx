'use client'

import { useState } from 'react'

export default function DeactivatePanel() {
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const WORD = 'deactivate'
  const canSubmit = confirm === WORD && !loading

  async function handle() {
    if (!canSubmit) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4 p-5">
      <p className="text-[12px] text-muted-foreground/60 leading-relaxed">
        Deactivating removes you from all workspaces and projects. Your data is retained
        but inaccessible. This can be reversed by contacting support.
      </p>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
          Type <span className="font-mono normal-case text-foreground/70">{WORD}</span> to
          confirm
        </label>
        <input
          type="text"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder={WORD}
          className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm
            text-foreground outline-none placeholder:text-muted-foreground/25
            focus:border-border transition-colors duration-100"
        />
      </div>

      <button
        onClick={handle}
        disabled={!canSubmit}
        className="flex items-center gap-2 rounded-lg border border-red-500/30
          bg-transparent px-3.5 py-2 text-xs font-semibold text-red-400 w-fit
          hover:bg-red-500/10 transition-colors duration-100
          disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Deactivate Account
      </button>
    </div>
  )
}
