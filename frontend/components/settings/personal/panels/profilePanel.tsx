'use client'

import { useRef } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { useUnsaved } from '@/components/settings/_components/useUnsaved'
import { getInitials } from '@/lib/utils'

const INITIAL = {
  fullName: 'Utpal Singh',
  avatarUrl: null as string | null,
}

export default function ProfilePanel() {
  const { values, set, dirty, saving, saved, discard, save } = useUnsaved(INITIAL)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    set('avatarUrl', URL.createObjectURL(file))
  }

  return (
    <div className="flex flex-col">
      {/* Fields */}
      <div className="flex flex-col gap-5 p-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div
            className="relative group cursor-pointer shrink-0"
            onClick={() => fileRef.current?.click()}
          >
            {values.avatarUrl ? (
              <img
                src={values.avatarUrl}
                alt="Avatar"
                className="h-14 w-14 rounded-xl object-cover ring-2 ring-border/40"
              />
            ) : (
              <div
                className="flex h-14 w-14 items-center justify-center rounded-xl
                bg-primary/20 text-[16px] font-bold text-primary ring-2 ring-border/40"
              >
                {getInitials(values.fullName || 'U')}
              </div>
            )}
            <div
              className="absolute inset-0 flex items-center justify-center rounded-xl
              bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            >
              <Camera size={16} className="text-white" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5
                text-xs font-medium text-foreground/70 w-fit
                hover:bg-accent hover:text-foreground transition-colors duration-100"
            >
              Upload photo
            </button>
            <p className="text-[11px] text-muted-foreground/40">PNG, JPG up to 2MB</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
            Full Name
          </label>
          <input
            type="text"
            value={values.fullName}
            onChange={e => set('fullName', e.target.value)}
            className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm
              text-foreground outline-none
              focus:border-primary/50 focus:bg-background transition-colors duration-100"
          />
        </div>
      </div>

      {/* Footer */}
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
