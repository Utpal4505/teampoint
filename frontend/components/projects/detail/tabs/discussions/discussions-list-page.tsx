'use client'

import Link from 'next/link'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Hash, Link2, Loader2, MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useProjectDetailContext } from '@/components/projects/detail/project-detail-context'
import {
  useDiscussionSocketEvents,
  useProjectDiscussions,
} from '@/features/discussions/hooks'
import type { DiscussionStatus } from '@/features/discussions/types'
import NewDiscussionModal from './new-discussion-modal'

export default function DiscussionsListPage() {
  const { project, projectId, tasks } = useProjectDetailContext()
  const [status, setStatus] = useState<DiscussionStatus>('OPEN')
  const [modalOpen, setModalOpen] = useState(false)
  const { data: discussions = [], isLoading } = useProjectDiscussions(projectId, {
    status,
  })
  useDiscussionSocketEvents(projectId)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-4 text-xs font-medium text-muted-foreground">
            {project.name} / Discussions
          </p>
          <h1 className="text-lg font-semibold text-foreground">Discussions</h1>
          <div className="mt-3 border-t border-dashed border-border" />
        </div>

        <Button size="sm" onClick={() => setModalOpen(true)}>
          <MessageSquarePlus className="h-3.5 w-3.5" />
          New
        </Button>
      </div>

      <div className="flex w-fit rounded-md border border-border bg-background p-1">
        {(['OPEN', 'CLOSED'] as DiscussionStatus[]).map(option => (
          <button
            key={option}
            onClick={() => setStatus(option)}
            className={cn(
              'h-7 rounded px-4 text-xs font-medium transition-colors',
              status === option
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {option === 'OPEN' ? 'Open' : 'Closed'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center rounded-lg border border-border">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : discussions.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
          <p className="text-sm font-medium text-foreground">No discussions found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Start a thread before the details get scattered.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {discussions.map(discussion => (
            <Link
              key={discussion.id}
              href={`/workspace/${project.workspaceId}/projects/${projectId}/discussions/${discussion.id}`}
              className="group rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/50 hover:bg-accent/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{discussion.title}</span>
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {discussion.description || 'No messages yet'}
                  </p>
                </div>
                <span
                  className={cn(
                    'rounded px-2 py-1 text-[10px] font-semibold',
                    discussion.status === 'OPEN'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {discussion.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {discussion.type === 'TASK' && (
                  <>
                    <Link2 className="h-3.5 w-3.5" />
                    <span>Linked task</span>
                    <span className="text-primary">.</span>
                  </>
                )}
                <span>{discussion.messageCount} messages</span>
                <span className="text-primary">.</span>
                <span>
                  Last activity{' '}
                  {formatDistanceToNow(new Date(discussion.updatedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <NewDiscussionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        projectId={projectId}
        tasks={tasks}
      />
    </div>
  )
}
