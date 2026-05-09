'use client'

import { FormEvent, useMemo, useState } from 'react'
import { Loader2, MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { ProjectTask } from '@/features/projects/detail/types'
import type { DiscussionType } from '@/features/discussions/types'
import { useCreateDiscussion } from '@/features/discussions/hooks'

interface NewDiscussionModalProps {
  open: boolean
  onClose: () => void
  projectId: number
  tasks: ProjectTask[]
}

export default function NewDiscussionModal({
  open,
  onClose,
  projectId,
  tasks,
}: NewDiscussionModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<DiscussionType>('GENERAL')
  const [contextId, setContextId] = useState('')
  const { mutate, isPending } = useCreateDiscussion(projectId)

  const projectTasks = useMemo(() => tasks.filter(task => task.id), [tasks])

  function reset() {
    setTitle('')
    setDescription('')
    setType('GENERAL')
    setContextId('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    mutate(
      {
        title,
        description,
        type,
        ...(type === 'TASK' && contextId ? { contextId: Number(contextId) } : {}),
      },
      {
        onSuccess: () => {
          reset()
          onClose()
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={value => !value && onClose()}>
      <DialogContent className="max-w-sm gap-4 rounded-xl border-border bg-background p-5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
            <MessageSquarePlus className="h-4 w-4 text-primary" />
            New Discussion
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Title</span>
            <Input
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="API error fix"
              maxLength={255}
              required
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Description
            </span>
            <Textarea
              value={description}
              onChange={event => setDescription(event.target.value)}
              placeholder="What should the team discuss?"
              maxLength={4000}
              rows={4}
            />
          </label>

          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Type</span>
            <div className="grid grid-cols-2 gap-2">
              {(['GENERAL', 'TASK'] as DiscussionType[]).map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setType(option)}
                  className={`rounded-md border px-3 py-2 text-left text-xs transition-colors ${
                    type === option
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {option === 'GENERAL' ? 'General' : 'Linked to task'}
                </button>
              ))}
            </div>
          </div>

          {type === 'TASK' && (
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Linked task
              </span>
              <select
                value={contextId}
                onChange={event => setContextId(event.target.value)}
                required
                className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm outline-none transition-colors focus:border-ring"
              >
                <option value="">Select task</option>
                {projectTasks.map(task => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </label>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
