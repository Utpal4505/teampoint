import { SidebarTrigger } from '@/components/ui/sidebar'

export default function ProjectsHeader() {
  return (
    <header
      className="sticky top-0 z-30 flex h-14 shrink-0 items-center border-b border-border
      bg-background/80 backdrop-blur-sm transition-[width,height] ease-linear
      group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
    >
      <div className="flex flex-1 items-center gap-3 px-6">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
        <div className="h-4 w-px shrink-0 bg-border" />
        <div className="flex-1">
          <h1 className="font-display text-lg font-bold tracking-tight text-foreground leading-none">
            Projects
          </h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Manage all workspace projects
          </p>
        </div>
      </div>
    </header>
  )
}
