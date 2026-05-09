'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CheckSquare,
  Video,
  FileText,
  MessageSquare,
  ChevronDown,
  Plus,
  Settings,
  Hash,
  Trash2,
  UserPlus,
  Users,
  PenLine,
  LogOut,
  BarChart2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Member {
  id: string
  name: string
  avatarUrl?: string
}

interface Channel {
  id: string
  name: string
  href?: string
  unread?: boolean
  count?: number
}

interface ProjectContextualSidebarProps {
  workspaceId: string | number
  projectId: string | number
  projectName: string
  members?: Member[]
  channels?: Channel[]
  userRole?: 'OWNER' | 'ADMIN' | 'MEMBER'
  totalTasks?: number
  doneTasks?: number
  onRename?: () => void
  onManageMembers?: () => void
  onInviteMembers?: () => void
  onDelete?: () => void
  onLeave?: () => void
}

// ─── Avatar Stack ─────────────────────────────────────────────────────────────

function AvatarStack({ members }: { members: Member[] }) {
  const visible = members.slice(0, 3)
  const extra = members.length - 3

  return (
    <div className="flex items-center shrink-0">
      <div className="flex -space-x-1.5">
        {visible.map(m => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={m.id}
            src={
              m.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=6366f1&color=fff&size=40`
            }
            alt={m.name}
            title={m.name}
            className="h-5.5 w-5.5 rounded-full ring-2 ring-sidebar object-cover"
          />
        ))}
      </div>
      {extra > 0 && (
        <span className="ml-1.5 text-[10px] text-muted-foreground font-medium shrink-0">
          +{extra}
        </span>
      )}
    </div>
  )
}

// ─── Nav Link — box style with active left border ────────────────────────────

function NavLink({
  href,
  icon: Icon,
  label,
  iconBg,
  iconColor,
}: {
  href: string
  icon: React.ElementType
  label: string
  iconBg: string
  iconColor: string
}) {
  const pathname = usePathname()
  const isActive = pathname.includes(href)

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150',
        isActive
          ? 'bg-accent text-foreground font-medium shadow-sm'
          : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
      )}
    >
      {/* Active left indicator bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-primary" />
      )}

      {/* Colored icon box */}
      <span
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-transform duration-150 group-hover:scale-105',
          iconBg,
        )}
      >
        <Icon className={cn('h-3.5 w-3.5', iconColor)} />
      </span>

      <span className="flex-1">{label}</span>

      {/* Active dot on right */}
      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0" />}
    </Link>
  )
}

// ─── Channel Item ─────────────────────────────────────────────────────────────

function ChannelContent({
  name,
  unread,
  count,
}: {
  name: string
  unread?: boolean
  count?: number
}) {
  return (
    <>
      <Hash className="h-3 w-3 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
      <span className="truncate flex-1 text-left">{name}</span>
      {typeof count === 'number' && count > 0 && (
        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
          {count}
        </span>
      )}
      {unread && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
    </>
  )
}

function ChannelItem({ channel }: { channel: Channel }) {
  const className =
    'group flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors'

  if (channel.href) {
    return (
      <Link href={channel.href} className={className}>
        <ChannelContent
          name={channel.name}
          unread={channel.unread}
          count={channel.count}
        />
      </Link>
    )
  }

  return (
    <button className={className}>
      <ChannelContent
        name={channel.name}
        unread={channel.unread}
        count={channel.count}
      />
    </button>
  )
}

// ─── Progress Card ────────────────────────────────────────────────────────────

function ProgressCard({ total, done }: { total: number; done: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const isComplete = pct === 100

  return (
    <div className="mx-2 mb-3 rounded-lg border border-border bg-accent/30 px-3 py-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted-foreground font-medium">Progress</span>
        <span
          className={cn(
            'text-xs font-semibold tabular-nums',
            isComplete ? 'text-emerald-500' : 'text-foreground',
          )}
        >
          {pct}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isComplete ? 'bg-emerald-500' : 'bg-primary',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        {done} / {total} tasks done
      </p>
    </div>
  )
}

// ─── Default channels ─────────────────────────────────────────────────────────

const DEFAULT_CHANNELS: Channel[] = [
  { id: 'c1', name: 'UI-updates', unread: true },
  { id: 'c2', name: 'Login-btn' },
  { id: 'c3', name: 'Design-review', unread: true },
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProjectContextualSidebar({
  workspaceId,
  projectId,
  projectName,
  members = [],
  channels = DEFAULT_CHANNELS,
  userRole = 'MEMBER',
  totalTasks = 0,
  doneTasks = 0,
  onRename,
  onManageMembers,
  onInviteMembers,
  onDelete,
  onLeave,
}: ProjectContextualSidebarProps) {
  const [discussionOpen, setDiscussionOpen] = useState(true)

  const base = `/workspace/${workspaceId}/projects/${projectId}`

  const navItems = [
    {
      href: `${base}/overview`,
      icon: BarChart2,
      label: 'Overview',
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-500',
    },
    {
      href: `${base}/tasks`,
      icon: CheckSquare,
      label: 'Tasks',
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-500',
    },
    {
      href: `${base}/meetings`,
      icon: Video,
      label: 'Meetings',
      iconBg: 'bg-violet-500/15',
      iconColor: 'text-violet-500',
    },
    {
      href: `${base}/documents`,
      icon: FileText,
      label: 'Docs',
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-500',
    },
  ]

  return (
    <div
      className={cn(
        'flex h-full w-65 shrink-0 flex-col border-r border-border bg-sidebar overflow-y-auto',
        'animate-in slide-in-from-left-2 duration-200',
      )}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-border min-w-0">
        <span className="truncate text-sm font-semibold text-foreground leading-tight flex-1 min-w-0">
          {projectName}
        </span>

        {members.length > 0 && <AvatarStack members={members} />}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              <Settings className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onRename}>
              <PenLine className="mr-2 h-3.5 w-3.5" />
              Rename Project
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onInviteMembers}>
              <UserPlus className="mr-2 h-3.5 w-3.5" />
              Invite Members
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onManageMembers}>
              <Users className="mr-2 h-3.5 w-3.5" />
              Manage Members
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {userRole === 'OWNER' ? (
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete Project
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={onLeave}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Leave Project
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── Nav Links ── */}
      <div className="flex flex-col gap-0.5 px-2 pt-3 pb-2">
        {navItems.map(item => (
          <NavLink key={item.href} {...item} />
        ))}
      </div>

      {/* ── Progress Card ── */}
      {totalTasks > 0 && <ProgressCard total={totalTasks} done={doneTasks} />}

      <div className="mx-3 border-t border-border" />

      {/* ── Discussion ── */}
      <div className="flex flex-col px-2 py-2 flex-1 min-h-0 overflow-y-auto">
        <button
          onClick={() => setDiscussionOpen(o => !o)}
          className="flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors w-full"
        >
          <div className="flex items-center gap-1.5">
            <MessageSquare className="h-3 w-3" />
            Discussion
          </div>
          <ChevronDown
            className={cn(
              'h-3 w-3 transition-transform duration-200',
              !discussionOpen && '-rotate-90',
            )}
          />
        </button>

        {discussionOpen && (
          <div className="flex flex-col gap-0.5 mt-1">
            {channels.map(ch => (
              <ChannelItem key={ch.id} channel={ch} />
            ))}
            <Link
              href={`${base}/discussions`}
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors mt-0.5"
            >
              <Plus className="h-3 w-3" />
              New Discussion
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
