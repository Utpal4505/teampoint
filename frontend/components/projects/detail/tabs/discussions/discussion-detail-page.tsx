'use client'

import { FormEvent, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format, formatDistanceToNow, isSameDay } from 'date-fns'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
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
  useDeleteDiscussion,
  useDeleteMessage,
  useDiscussion,
  useDiscussionMessages,
  useDiscussionSocketEvents,
  useProjectDiscussions,
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
    .toUpperCase()
}

function MessageRow({
  message,
  mine,
  onDelete,
  onReply,
}: {
  message: Message
  mine: boolean
  onDelete: (id: number) => void
  onReply: (message: Message) => void
}) {
  const avatarUrl = message.createdBy.avatarUrl ?? initials(message.createdBy.fullName)

  return (
    <div className="group relative flex gap-3 rounded-md px-2 py-1 hover:bg-muted/40 transition-colors">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-semibold text-primary">
        <img src={avatarUrl} alt={message.createdBy.fullName} />
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
        </div>
        <div className="mt-1 text-sm text-foreground/90">
          {decodeHtml(message.content)
            .split('\n')
            .map((line, i) => {
              if (line.startsWith('> ')) {
                return (
                  <div
                    key={i}
                    className="mb-1 border-l-2 border-muted-foreground/40 pl-2 text-xs text-muted-foreground italic"
                  >
                    {line.slice(2)}
                  </div>
                )
              }
              return (
                <p key={i} className="whitespace-pre-wrap wrap-break-word">
                  {line}
                </p>
              )
            })}
        </div>
      </div>

      {/* Discord-style action toolbar */}
      <div className="absolute right-2 top-0 -translate-y-1/2 flex items-center gap-0.5 rounded-md border border-border bg-background shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onReply(message)}
          className="flex items-center gap-1 rounded-l-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Reply"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 14 4 9 9 4" />
            <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
          </svg>
          Reply
        </button>
        {mine && (
          <>
            <div className="w-px h-5 bg-border" />
            <button
              onClick={() => onDelete(message.id)}
              className="flex items-center gap-1 rounded-r-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              aria-label="Delete message"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function decodeHtml(str: string) {
  return str
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
}

export default function DiscussionDetailPage({
  discussionId,
}: DiscussionDetailPageProps) {
  const router = useRouter()
  const { project, projectId, workspaceId } = useProjectDetailContext()
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const [content, setContent] = useState('')
  const [asDecision, setAsDecision] = useState(false)
  const [editing, setEditing] = useState(false)
  const [decisionsOpen, setDecisionsOpen] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const messageRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const { data: user } = useCurrentUser()
  const { data: projectDiscussions = [] } = useProjectDiscussions(projectId)
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
  const { mutate: deleteDiscussion, isPending: deleting } = useDeleteDiscussion(
    projectId,
    discussionId,
  )
  const { mutate: updateDiscussion, isPending: updating } = useUpdateDiscussion(
    projectId,
    discussionId,
  )
  useDiscussionSocketEvents(projectId, discussionId)

  const fallbackDiscussion = projectDiscussions.find(item => item.id === discussionId)
  const activeDiscussion = discussion ?? fallbackDiscussion
  const currentMember = project.projectMembers?.find(
    member => member.user.id === user?.id,
  )
  const canCreateDecision =
    activeDiscussion?.createdBy.id === user?.id ||
    currentMember?.role === 'OWNER' ||
    currentMember?.role === 'ADMIN'
  const canManageDiscussion = canCreateDecision

  const decisionCount = useMemo(
    () => messages.filter(message => message.type === 'DECISION').length,
    [messages],
  )
  const decisionMessages = useMemo(
    () => messages.filter(message => message.type === 'DECISION'),
    [messages],
  )

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!content.trim()) return

    const replyText = decodeHtml(replyTo?.content || '')

    const fullContent = replyTo
      ? `> @${replyTo.createdBy.fullName}: ${replyText.slice(0, 80)}${replyText.length > 80 ? '…' : ''}\n\n${content}`
      : content

    createMessage(
      {
        content: fullContent,
        type: asDecision && canCreateDecision ? 'DECISION' : 'NORMAL',
      },
      {
        onSuccess: () => {
          setContent('')
          setAsDecision(false)
          setReplyTo(null)
        },
      },
    )
  }

  function openEditDialog() {
    setEditTitle(activeDiscussion?.title ?? '')
    setEditDescription(activeDiscussion?.description ?? '')
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

  function handleDeleteDiscussion() {
    const confirmed = window.confirm('Delete this discussion and all of its messages?')

    if (!confirmed) return

    deleteDiscussion(undefined, {
      onSuccess: () => {
        router.push(`/workspace/${workspaceId}/projects/${projectId}/discussions`)
      },
    })
  }

  function jumpToDecision(messageId: number) {
    setDecisionsOpen(false)
    window.setTimeout(() => {
      messageRefs.current[messageId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 150)
  }

  if (discussionLoading && !activeDiscussion) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!activeDiscussion) {
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
          <Link href={`/workspace/${workspaceId}/projects/${projectId}/discussions`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <h1 className="flex min-w-0 flex-1 items-center gap-2 text-base font-semibold">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">{activeDiscussion.title}</span>
        </h1>

        <button
          onClick={() => setDecisionsOpen(true)}
          disabled={decisionCount === 0}
          className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Decisions({decisionCount})
        </button>

        {canManageDiscussion && (
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() =>
              activeDiscussion.status === 'OPEN' ? closeDiscussion() : reopenDiscussion()
            }
            disabled={closing || reopening}
            title={
              activeDiscussion.status === 'OPEN'
                ? 'Close discussion'
                : 'Reopen discussion'
            }
          >
            {activeDiscussion.status === 'OPEN' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
          </Button>
        )}

        {canManageDiscussion && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {activeDiscussion.status === 'OPEN' ? (
                <DropdownMenuItem onClick={() => closeDiscussion()} disabled={closing}>
                  <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                  Close Discussion
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => reopenDiscussion()} disabled={reopening}>
                  <RotateCcw className="mr-2 h-3.5 w-3.5" />
                  Reopen Discussion
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={openEditDialog}>Change Title</DropdownMenuItem>
              <DropdownMenuItem onClick={openEditDialog}>
                Change Description
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeleteDiscussion}
                disabled={deleting}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete Discussion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
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
                <div
                  key={message.id}
                  ref={node => {
                    messageRefs.current[message.id] = node
                  }}
                  className="scroll-mt-24"
                >
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
                    onReply={setReplyTo}
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
        {activeDiscussion.status === 'CLOSED' ? (
          <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            This discussion is closed. Reopen it before sending new messages.
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-muted/20 p-2">
            {replyTo && (
              <div className="mb-2 flex items-start justify-between gap-2 rounded-md border-l-2 border-primary bg-primary/5 px-2 py-1.5">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-primary">
                    {replyTo.createdBy.fullName}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {decodeHtml(replyTo.content).slice(0, 100)}
                  </p>
                </div>
                <button
                  onClick={() => setReplyTo(null)}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <Textarea
              value={content}
              onChange={event => setContent(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  if (content.trim() && !creating) {
                    event.currentTarget.form?.requestSubmit()
                  }
                }
              }}
              placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
              rows={3}
              maxLength={4000}
              className="min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center justify-between gap-3 pt-2">
              {canCreateDecision ? (
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
              ) : (
                <span className="text-xs text-muted-foreground">
                  Members send normal messages
                </span>
              )}
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

      <Sheet open={decisionsOpen} onOpenChange={setDecisionsOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Decisions</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {decisionMessages.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                No decisions have been marked yet.
              </div>
            ) : (
              <div className="space-y-3">
                {decisionMessages.map(message => (
                  <button
                    key={message.id}
                    onClick={() => jumpToDecision(message.id)}
                    className="w-full rounded-lg border border-border bg-background p-3 text-left transition-colors hover:border-primary/50 hover:bg-accent/30"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-xs font-semibold text-foreground">
                        {message.createdBy.fullName}
                      </span>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-4 text-sm text-muted-foreground">
                      {message.content}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
