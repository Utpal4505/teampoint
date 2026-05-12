'use client'

import { createContext, useContext } from 'react'
import type {
  ProjectDetail,
  ProjectTask,
  ProjectDocument,
  MeetingListItem,
} from '@/features/projects/detail/types'

export type TabKey =
  | 'tasks'
  | 'overview'
  | 'documents'
  | 'members'
  | 'meetings'
  | 'discussions'

interface ProjectDetailContextValue {
  workspaceId: number
  projectId: number
  project: ProjectDetail
  tasks: ProjectTask[]
  documents: ProjectDocument[]
  meetings: MeetingListItem[]
  isLoading: boolean
  onTabChange: (tab: TabKey) => void
  onStatusChange: (taskId: number, status: string) => void
}

export const ProjectDetailContext = createContext<ProjectDetailContextValue | null>(null)

export function useProjectDetailContext() {
  const ctx = useContext(ProjectDetailContext)
  if (!ctx) throw new Error('useProjectDetailContext must be used within ProjectLayoutShell')
  return ctx
}
