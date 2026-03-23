import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import SettingsTabBar from '@/components/settings/_components/settingsTabBar'

export default async function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ workspaceId: string; tab: string }>
}) {
  const { workspaceId, tab } = await params

  return (
    <SidebarInset>
      <div className="sticky top-0 z-20">
        <div
          className="flex items-center gap-3 px-6 py-4 border-b border-border/30
          bg-background/80 backdrop-blur-sm"
        >
          <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
          <div className="h-4 w-px shrink-0 bg-border" />
          <h1 className="text-base font-bold text-foreground">Settings</h1>
        </div>
        <SettingsTabBar activeTab={tab} workspaceId={workspaceId} />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-xl px-6 py-8">{children}</div>
      </div>
    </SidebarInset>
  )
}
