'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Zap, CheckCircle2 } from 'lucide-react'
import type { Meeting } from './meetings.types'

// Fake project members for assignee dropdown — swap with real data later
const FAKE_MEMBERS = [
  { id: 1, name: 'Utpal Kumar' },
  { id: 2, name: 'Rahul Sharma' },
  { id: 3, name: 'Aman Verma' },
  { id: 4, name: 'Neha Singh' },
  { id: 5, name: 'Dev Patel' },
]

interface ActionItemDraft {
  id: string
  title: string
  assignedTo: number | null
  dueDate: string
}

interface CompleteMeetingModalProps {
  meeting: Meeting
  onClose: () => void
  onComplete: (data: {
    keyDecisions: string
    actionItems: { title: string; assignedTo: number; dueDate?: string }[]
  }) => void
}

export default function CompleteMeetingModal({
  meeting,
  onClose,
  onComplete,
}: CompleteMeetingModalProps) {
  const [keyDecisions, setKeyDecisions] = useState('')
  const [items, setItems] = useState<ActionItemDraft[]>([])

  function addItem() {
    setItems(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: '',
        assignedTo: null,
        dueDate: '',
      },
    ])
  }

  function updateItem(id: string, patch: Partial<ActionItemDraft>) {
    setItems(prev => prev.map(it => (it.id === id ? { ...it, ...patch } : it)))
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(it => it.id !== id))
  }

  function handleConfirm() {
    const validItems = items.filter(it => it.title.trim() && it.assignedTo !== null)
    onComplete({
      keyDecisions: keyDecisions.trim(),
      actionItems: validItems.map(it => ({
        title: it.title.trim(),
        assignedTo: it.assignedTo!,
        ...(it.dueDate ? { dueDate: it.dueDate } : {}),
      })),
    })
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      <div
        className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2
          w-full max-w-[520px] rounded-2xl border border-border bg-background
          shadow-2xl shadow-black/25 flex flex-col overflow-hidden"
        style={{ maxHeight: '88vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle2 size={13} className="text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Complete Meeting</h2>
              <p className="text-[11px] text-muted-foreground/50 truncate max-w-[260px]">
                {meeting.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg
              text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 p-5 overflow-y-auto flex-1">
          {/* Key decisions */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-semibold text-muted-foreground/70
              uppercase tracking-wider"
            >
              Key Decisions
              <span
                className="ml-1.5 text-[10px] normal-case font-normal
                text-muted-foreground/40"
              >
                optional
              </span>
            </label>
            <textarea
              value={keyDecisions}
              onChange={e => setKeyDecisions(e.target.value)}
              placeholder="What was decided in this meeting?"
              rows={3}
              className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm
                text-foreground placeholder:text-muted-foreground/30 outline-none resize-none
                focus:border-primary/40 focus:bg-background transition-colors duration-100"
            />
          </div>

          {/* Action items */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label
                className="text-[11px] font-semibold text-muted-foreground/70
                uppercase tracking-wider"
              >
                Action Items
                <span
                  className="ml-1.5 text-[10px] normal-case font-normal
                  text-muted-foreground/40"
                >
                  optional
                </span>
              </label>
              {items.length > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-primary/70 font-medium">
                  <Zap size={10} /> Will auto-create as tasks
                </span>
              )}
            </div>

            {/* Items list */}
            {items.length > 0 && (
              <div className="flex flex-col gap-2.5">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-xl border border-border/60
                      bg-muted/10 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold text-muted-foreground/40
                        uppercase tracking-wider w-4 shrink-0"
                      >
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={item.title}
                        onChange={e => updateItem(item.id, { title: e.target.value })}
                        placeholder="Task title…"
                        className="flex-1 rounded-lg border border-border/50 bg-background
                          px-3 py-1.5 text-xs text-foreground
                          placeholder:text-muted-foreground/30 outline-none
                          focus:border-primary/40 transition-colors duration-100"
                      />
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-lg
                          text-muted-foreground/30 hover:bg-red-500/10 hover:text-red-400
                          transition-colors duration-100 shrink-0"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 ml-6">
                      {/* Assignee */}
                      <select
                        value={item.assignedTo ?? ''}
                        onChange={e =>
                          updateItem(item.id, {
                            assignedTo: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        className="flex-1 rounded-lg border border-border/50 bg-background
                          px-2.5 py-1.5 text-xs text-foreground outline-none
                          focus:border-primary/40 transition-colors duration-100"
                      >
                        <option value="">Assign to…</option>
                        {FAKE_MEMBERS.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>

                      {/* Due date */}
                      <input
                        type="date"
                        value={item.dueDate}
                        onChange={e => updateItem(item.id, { dueDate: e.target.value })}
                        className="rounded-lg border border-border/50 bg-background
                          px-2.5 py-1.5 text-xs text-foreground outline-none
                          focus:border-primary/40 transition-colors duration-100"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add item button */}
            <button
              onClick={addItem}
              className="flex items-center justify-center gap-2 rounded-xl
                border border-dashed border-border/60 py-2.5 text-xs font-medium
                text-muted-foreground hover:bg-accent hover:text-foreground
                hover:border-border transition-colors duration-100"
            >
              <Plus size={12} /> Add Action Item
            </button>

            {/* Info banner */}
            {items.length > 0 && (
              <div
                className="flex items-center gap-2.5 rounded-xl bg-primary/5
                border border-primary/15 px-3.5 py-2.5"
              >
                <Zap size={13} className="text-primary shrink-0" />
                <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
                  <span className="font-semibold text-primary">
                    {items.filter(i => i.title.trim() && i.assignedTo).length} action item
                    {items.filter(i => i.title.trim() && i.assignedTo).length !== 1
                      ? 's'
                      : ''}
                  </span>{' '}
                  will be created as project tasks automatically.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-5 py-4
          border-t border-border/60 bg-muted/10 shrink-0"
        >
          <button
            onClick={onClose}
            className="rounded-xl border border-border/60 bg-background px-4 py-2
              text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground
              transition-colors duration-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2
              text-xs font-semibold text-primary-foreground
              hover:bg-primary/90 transition-colors duration-100"
          >
            <CheckCircle2 size={11} /> Complete Meeting
          </button>
        </div>
      </div>
    </>
  )
}
