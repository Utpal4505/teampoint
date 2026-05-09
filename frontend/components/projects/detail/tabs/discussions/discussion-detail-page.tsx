'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { format, isSameDay } from 'date-fns'
import {
  ArrowLeft,
  CheckCircle2,
  Hash,
  Loader2,
  MoreHorizontal,
  RotateCcw,
  Send,
  Trash2,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useProjectDetailContext } from '@/components/projects/detail/project-detail-context'
import { useCurrentUser } from '@/features/users/hooks'
import {
  useCloseDiscussion,
  useCreateMessage,
  useDeleteMessage,
  useDiscussion,
  useDiscussionMessages,
  useDiscussionSocketEvents,
  useUpdateDiscussion,
  useReopenDiscussion,
} from '@/features/discussions/hooks'
import type { Message } from '@/features/discussions/types'

interface DiscussionDetailPageProps {
  discussionId: number
}

function initials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function MessageRow({
  message,
  mine,
  onDelete,
}: {
  message: Message
  mine: boolean
  onDelete: (id: number) => void
}) {
  return (
    <div className="group flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-semibold text-primary">
        {initials(message.createdBy.fullName)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">
            {message.createdBy.fullName}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {format(new Date(message.createdAt), 'HH:mm')}
          </span>
          {message.type === 'DECISION' && (
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              Decision
            </span>
          )}
          {mine && (
            <button
              onClick={() => onDelete(message.id)}
              className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Delete message"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
            </button>
          )}
        </div>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground/90">
          {message.content}
        </p>
      </div>
    </div>
  )
}

export default function DiscussionDetailPage({
  discussionId,
}: DiscussionDetailPageProps) {
  const { project, projectId } = useProjectDetailContext()
  const [content, setContent] = useState('')
  const [asDecision, setAsDecision] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const { data: user } = useCurrentUser()
  const { data: discussion, isLoading: discussionLoading } = useDiscussion(
    projectId,
    discussionId,
  )
  const { data: messages = [], isLoading: messagesLoading } = useDiscussionMessages(
    projectId,
    discussionId,
  )
  const { mutate: createMessage, isPending: creating } = useCreateMessage(
    projectId,
    discussionId,
  )
  const { mutate: deleteMessage } = useDeleteMessage(projectId, discussionId)
  const { mutate: closeDiscussion, isPending: closing } = useCloseDiscussion(
    projectId,
    discussionId,
  )
  const { mutate: reopenDiscussion, isPending: reopening } = useReopenDiscussion(
    projectId,
    discussionId,
  )
  const { mutate: updateDiscussion, isPending: updating } = useUpdateDiscussion(
    projectId,
    discussionId,
  )
  useDiscussionSocketEvents(projectId, discussionId)

  const decisionCount = useMemo(
    () => messages.filter(message => message.type === 'DECISION').length,
    [messages],
  )

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!content.trim()) return

    createMessage(
      {
        content,
        type: asDecision ? 'DECISION' : 'NORMAL',
      },
      {
        onSuccess: () => {
          setContent('')
          setAsDecision(false)
        },
      },
    )
  }

  function openEditDialog() {
    setEditTitle(discussion?.title ?? '')
    setEditDescription(discussion?.description ?? '')
    setEditing(true)
  }

  function handleUpdateDiscussion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    updateDiscussion(
      {
        title: editTitle,
        description: editDescription,
      },
      {
        onSuccess: () => setEditing(false),
      },
    )
  }

  if (discussionLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!discussion) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Discussion not found.
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 shrink-0 items-center gap-3 border-b border-dashed border-border px-5">
        <Button asChild variant="ghost" size="icon-sm">
          <Link href={`/workspace/${project.workspaceId}/projects/${projectId}/discussions`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <h1 className="flex min-w-0 flex-1 items-center gap-2 text-base font-semibold">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">{discussion.title}</span>
        </h1>

        <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          Decisions({decisionCount})
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            {discussion.status === 'OPEN' ? (
              <DropdownMenuItem
                onClick={() => closeDiscussion()}
                disabled={closing}
              >
                <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                Close Discussion
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => reopenDiscussion()}
                disabled={reopening}
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5" />
                Reopen Discussion
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditDialog}>
              Change Title
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openEditDialog}>
              Change Description
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="text-destructive">
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete Discussion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {messagesLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
            <p className="text-sm font-medium text-foreground">No messages yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Be the first one to move this forward.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => {
              const previous = messages[index - 1]
              const showDate =
                !previous ||
                !isSameDay(new Date(previous.createdAt), new Date(message.createdAt))

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="my-5 flex items-center gap-3">
                      <div className="h-px flex-1 bg-border" />
                      <span className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
                        {format(new Date(message.createdAt), 'EEEE, MMMM d')}
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  )}
                  <MessageRow
                    message={message}
                    mine={message.createdBy.id === user?.id}
                    onDelete={deleteMessage}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-border bg-background p-4"
      >
        {discussion.status === 'CLOSED' ? (
          <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            This discussion is closed. Reopen it before sending new messages.
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-muted/20 p-2">
            <Textarea
              value={content}
              onChange={event => setContent(event.target.value)}
              placeholder="Type a message"
              rows={3}
              maxLength={4000}
              className="min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAsDecision(value => !value)}
                className={cn(
                  'rounded-md border px-2 py-1 text-xs transition-colors',
                  asDecision
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:text-foreground',
                )}
              >
                Decision
              </button>
              <Button type="submit" size="sm" disabled={creating || !content.trim()}>
                {creating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                Send
              </Button>
            </div>
          </div>
        )}
      </form>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Discussion</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateDiscussion} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">Title</span>
              <Input
                value={editTitle}
                onChange={event => setEditTitle(event.target.value)}
                minLength={2}
                maxLength={255}
                required
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Description
              </span>
              <Textarea
                value={editDescription}
                onChange={event => setEditDescription(event.target.value)}
                maxLength={4000}
                rows={4}
              />
            </label>
            <Button type="submit" className="w-full" disabled={updating}>
              {updating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
