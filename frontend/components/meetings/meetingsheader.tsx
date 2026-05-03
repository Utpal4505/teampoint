// import { SidebarTrigger } from '@/components/ui/sidebar'
import { Video } from 'lucide-react'

export default function MeetingsHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-border bg-background/95 backdrop-blur-lg">
      <div className="flex flex-1 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {/* <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" /> */}
          {/* <div className="h-6 w-px shrink-0 bg-border" /> */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/10 border border-primary/15">
              <Video size={18} className="text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground leading-tight">
                Meetings
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage all workspace meetings
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
