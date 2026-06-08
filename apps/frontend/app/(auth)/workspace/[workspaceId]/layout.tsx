'use client'

import { ReactNode } from 'react'
import { useParams } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import {
  useFetchWorkspaceById,
  useListUserWorkspaces,
} from '@/features/workspace/hooks'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const params = useParams()
  const workspaceId = Number(params.workspaceId)

  const { data: workspaces, isLoading } = useListUserWorkspaces()
  const { data: workspaceDetail, isLoading: isWorkspaceDetailLoading } =
    useFetchWorkspaceById(workspaceId)

  if (isLoading || isWorkspaceDetailLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading workspace...</p>
      </div>
    )
  }

  const workspaceExists = workspaces?.some(ws => ws.id === workspaceId)

  if (!workspaceExists && !workspaceDetail) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">Workspace not found</p>
      </div>
    )
  }

  return (
    <SidebarProvider
      defaultOpen={false}
    >
      {' '}
      <AppSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </SidebarProvider>
  )
}
