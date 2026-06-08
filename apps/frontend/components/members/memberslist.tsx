'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GetWorkspaceDTO } from '@/features/workspace/types'
import { Search, Filter, MoreHorizontal, ChevronDown, UserPlus, ShieldAlert, Trash2, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUpdateWorkspaceMemberRole, useRemoveWorkspaceMember } from '@/features/workspace/hooks'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface MembersListProps {
  workspaceId: number
  members: GetWorkspaceDTO['workspaceMembers']
  currentUserId?: number
  ownerId?: number
  isAdmin?: boolean
  onInviteClick?: () => void
}

export default function MembersList({ 
  workspaceId,
  members, 
  currentUserId, 
  ownerId,
  isAdmin,
  onInviteClick 
}: MembersListProps) {
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  // Filter members
  const filteredMembers = members.filter((member) => {
    return roleFilter === 'ALL' || member.role === roleFilter
  })

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const paginatedMembers = filteredMembers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateWorkspaceMemberRole()
  const { mutate: removeMember, isPending: isRemovingMember } = useRemoveWorkspaceMember()
  const [loadingMemberId, setLoadingMemberId] = useState<number | null>(null)

  const handleRoleChange = (memberId: number, newRole: 'ADMIN' | 'MEMBER') => {
    setLoadingMemberId(memberId)
    updateRole(
      { workspaceId, targetUserId: memberId, role: newRole },
      {
        onSuccess: () => {
          toast.success('Role updated successfully')
          setLoadingMemberId(null)
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || 'Failed to update role')
          setLoadingMemberId(null)
        }
      }
    )
  }

  const handleRemoveMember = (memberId: number) => {
    if (!confirm('Are you sure you want to remove this member from the workspace?')) return
    
    setLoadingMemberId(memberId)
    removeMember(
      { workspaceId, targetUserId: memberId },
      {
        onSuccess: () => {
          toast.success('Member removed successfully')
          setLoadingMemberId(null)
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || 'Failed to remove member')
          setLoadingMemberId(null)
        }
      }
    )
  }

  const startCount = (page - 1) * itemsPerPage + 1
  const endCount = Math.min(page * itemsPerPage, filteredMembers.length)

  if (!members || members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-card mt-6">
        <p className="text-muted-foreground">No members found.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 mt-6">
      {/* Top Bar: Filter and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px] bg-background rounded-full border-border/60 hover:border-border/80 transition-colors shadow-sm text-xs font-medium">
              <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground/70" />
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/60 shadow-xl">
              <SelectItem value="ALL" className="text-xs">All Roles</SelectItem>
              <SelectItem value="ADMIN" className="text-xs">Admin</SelectItem>
              <SelectItem value="MEMBER" className="text-xs">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isAdmin && (
          <Button 
            onClick={onInviteClick}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-sm
            font-medium text-primary-foreground shadow-[0_2px_12px_oklch(0.6_0.16_262/0.3)]
            transition-all hover:opacity-90 hover:-translate-y-px active:scale-[0.98] h-9"
          >
            <UserPlus size={14} /> Invite Member
          </Button>
        )}
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden shadow-[0_2px_20px_oklch(0_0_0/0.02)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/10 hover:bg-muted/10 border-b-border/60">
              <TableHead className="w-[400px] pl-6 font-semibold text-xs tracking-wider text-muted-foreground uppercase h-11">Name</TableHead>
              <TableHead className="font-semibold text-xs tracking-wider text-muted-foreground uppercase h-11">Role</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMembers.map((member) => {
              const isCurrentUser = member.user.id === currentUserId
              const isOwner = member.user.id === ownerId
              
              return (
                <TableRow key={member.user.id}>
                  <TableCell className="pl-6 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={member.user.avatarUrl || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {member.user.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground text-sm flex items-center gap-1.5">
                          {member.user.fullName}
                          {isCurrentUser && (
                            <span className="text-muted-foreground font-normal">(You)</span>
                          )}
                          {isOwner && (
                            <span className="bg-amber-400/20 text-amber-600 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">OWNER</span>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5">
                          Joined {new Date(member.joinedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    {isOwner ? (
                      <div className="w-[130px] h-8 flex items-center px-3 text-xs font-semibold text-muted-foreground bg-muted/10 rounded-md border border-transparent">
                        Owner
                      </div>
                    ) : (
                      <Select 
                        value={member.role} 
                        disabled={isCurrentUser || !isAdmin || loadingMemberId === member.user.id}
                        onValueChange={(val: 'ADMIN' | 'MEMBER') => handleRoleChange(member.user.id, val)}
                      >
                        <SelectTrigger className="w-[130px] h-8 text-xs bg-muted/30 border-transparent hover:bg-muted/50 transition-colors">
                          {loadingMemberId === member.user.id ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-2" />
                          ) : null}
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="MEMBER">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="pr-6 py-3 text-right">
                    {(!isCurrentUser && !isOwner && isAdmin) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem 
                            onClick={() => handleRemoveMember(member.user.id)}
                            disabled={loadingMemberId === member.user.id}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center gap-2 cursor-pointer"
                          >
                            {loadingMemberId === member.user.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
            
            {paginatedMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-muted-foreground/60 text-sm">
                  No members found matching your filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/10">
          <div className="text-sm text-muted-foreground">
            {filteredMembers.length > 0 ? (
              <>
                Viewing {startCount}-{endCount} of {filteredMembers.length} member{filteredMembers.length !== 1 && 's'}
              </>
            ) : (
              'No members'
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-xs h-8"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="text-xs h-8"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
