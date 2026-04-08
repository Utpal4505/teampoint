'use client'

import { useState } from 'react'
import { SidebarInset } from '@/components/ui/sidebar'
import { Loader2 } from 'lucide-react'
import { useWorkspaceMeetings } from '@/features/meetings/hooks'
import type { MeetingStatus } from '@/features/meetings/types'
import MeetingsHeader from './meetingsheader'
import MeetingsToolbar, {
  type MeetingViewMode,
  type MeetingStatusFilter,
} from './meetingstoolbar'
import MeetingsEmpty from './meetingsempty'
import MeetingsGrid from './meetingsgrid'
import MeetingsListView from './meetingslistview'

interface MeetingsPageProps {
  workspaceId: string
}

export default function MeetingsPage({ workspaceId }: MeetingsPageProps) {
  const [view, setView] = useState<MeetingViewMode>('grid')
  const [statusFilter, setStatusFilter] = useState<MeetingStatusFilter>('ALL')
  const [statusOpen, setStatusOpen] = useState(false)

  const numWorkspaceId = Number(workspaceId)
  const { data: meetingsResponse, isLoading } = useWorkspaceMeetings(numWorkspaceId)
  const meetings = meetingsResponse?.data ?? []

  // Filter by status
  const filtered = meetings.filter(m => {
    if (statusFilter === 'ALL') return true
    return m.status === statusFilter
  })

  if (isLoading) {
    return (
      <SidebarInset className="bg-gradient-to-b from-background to-background/50">
        <MeetingsHeader />
        <div className="flex flex-1 items-center justify-center flex-col gap-3">
          <Loader2 size={32} className="animate-spin text-primary/40" />
          <p className="text-sm text-muted-foreground">Loading your meetings...</p>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset className="flex flex-col bg-background">
      <MeetingsHeader />

      <MeetingsToolbar
        view={view}
        onViewChange={setView}
        statusFilter={statusFilter}
        onStatusChange={status => {
          setStatusFilter(status)
          setStatusOpen(false)
        }}
        statusOpen={statusOpen}
        onStatusToggle={() => setStatusOpen(o => !o)}
      />

      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <MeetingsEmpty />
        ) : (
          <div className="p-6 space-y-6">
            {view === 'grid' ? (
              <MeetingsGrid meetings={filtered} />
            ) : (
              <MeetingsListView meetings={filtered} />
            )}
          </div>
        )}
      </div>
    </SidebarInset>
  )
}
