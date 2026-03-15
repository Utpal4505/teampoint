import { AlertTriangle } from 'lucide-react'
import type { Meeting } from './meetings.types'

interface CancelConfirmModalProps {
  meeting: Meeting
  onCancel: () => void
  onConfirm: () => void
}

export default function CancelConfirmModal({
  meeting,
  onCancel,
  onConfirm,
}: CancelConfirmModalProps) {
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onCancel} />

      <div
        className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2
        w-full max-w-sm rounded-2xl border border-border bg-background
        shadow-2xl shadow-black/25 p-6 flex flex-col gap-4"
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center
            rounded-xl bg-red-500/10"
          >
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-foreground">Cancel meeting?</h3>
            <p className="text-[13px] text-muted-foreground/70 leading-relaxed">
              <span className="font-medium text-foreground">{meeting.title}</span> will be
              cancelled and the Google Calendar event will be deleted.
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="rounded-xl border border-border/60 bg-background px-4 py-2
              text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground
              transition-colors duration-100"
          >
            Keep Meeting
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold
              text-white hover:bg-red-600 transition-colors duration-100"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </>
  )
}
