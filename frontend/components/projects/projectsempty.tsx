import { FolderOpen } from 'lucide-react'

export default function ProjectsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl
        border border-border bg-muted/30 text-muted-foreground"
      >
        <FolderOpen size={22} />
      </div>
      <p className="text-sm font-medium text-foreground">No projects found</p>
      <p className="text-xs text-muted-foreground">Try a different status filter</p>
    </div>
  )
}
