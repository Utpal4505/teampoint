import { create } from 'zustand'

type WorkspaceStore = {
  currentWorkspaceId: number | null
  setCurrentWorkspace: (id: number) => void
}

export const useWorkspaceStore = create<WorkspaceStore>(set => ({
  currentWorkspaceId: null,
  setCurrentWorkspace: id => set({ currentWorkspaceId: id }),
}))
