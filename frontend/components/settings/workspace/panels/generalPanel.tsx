'use client'

import { Loader2 } from 'lucide-react'
import { useUnsaved } from '@/components/settings/_components/useUnsaved'

const INITIAL = {
  name: 'TeamPoint',
  description: 'Startup workspace for building and shipping fast.',
}

export default function WorkspaceGeneralPanel() {
  const { values, set, dirty, saving, saved, discard, save } = useUnsaved(INITIAL)

  return (
    <div className="flex flex-col">
      {/* Fields */}
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
            Workspace Name
          </label>
          <input
            type="text"
            value={values.name}
            onChange={e => set('name', e.target.value)}
            className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm
              text-foreground outline-none
              focus:border-primary/50 focus:bg-background transition-colors duration-100"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
            Description
            <span className="ml-1.5 normal-case font-normal text-muted-foreground/35">
              optional
            </span>
          </label>
          <textarea
            value={values.description}
            onChange={e => set('description', e.target.value)}
            rows={3}
            placeholder="What is this workspace for?"
            className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm
              text-foreground outline-none resize-none
              focus:border-primary/50 focus:bg-background transition-colors duration-100"
          />
        </div>
      </div>

      {/* Footer — always visible */}
      <div
        className="flex items-center justify-end gap-2 px-5 py-3.5
        border-t border-border/40 bg-muted/10"
      >
        {dirty && (
          <button
            onClick={discard}
            className="rounded-lg border border-border/50 px-3.5 py-1.5 text-xs
              font-medium text-muted-foreground hover:bg-accent
              transition-colors duration-100"
          >
            Discard
          </button>
        )}
        <button
          onClick={() =>
            save(async () => {
              await new Promise(r => setTimeout(r, 800))
            })
          }
          disabled={!dirty || saving}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5
            text-xs font-semibold text-primary-foreground
            hover:bg-primary/90 transition-colors duration-100
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 size={11} className="animate-spin" /> Saving…
            </>
          ) : saved ? (
            '✓ Saved'
          ) : (
            'Save changes'
          )}
        </button>
      </div>
    </div>
  )
}
