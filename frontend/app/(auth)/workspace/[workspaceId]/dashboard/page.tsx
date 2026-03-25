'use client'

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MyTasksCard } from '@/components/dashboard/mytaskscard'
import { TodaysMeetingsCard } from '@/components/dashboard/todaysmeetingscard'
import { WorkspaceActivityCard } from '@/components/dashboard/teamactivitycard'
import { useCurrentUser } from '@/features/users/hooks'
import { Spinner } from '@/components/ui/spinner'
import { useUserStore } from '@/store/user.store'
import { useEffect } from 'react'

const getGreetingData = () => {
  const hour = new Date().getHours()
  if (hour < 12) return { text: 'Good morning' }
  if (hour < 17) return { text: 'Good afternoon' }
  if (hour < 21) return { text: 'Good evening' }
  return { text: 'Good night' }
}

export default function DashboardPage() {
  const { data: user, isLoading } = useCurrentUser()

  useEffect(() => {
    if (user) {
      useUserStore.getState().setUser(user)
    }
  }, [user])

  const { text } = getGreetingData()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!user) return null

  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '??'

  return (
    <SidebarInset>
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center border-b border-border bg-background/80 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex flex-1 items-center gap-3 px-6">
          <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
          <div className="h-4 w-px shrink-0 bg-border" />
          <h1 className="flex-1 font-display text-lg font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-y-auto bg-background p-6">
        <div className="mb-8 flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={user.avatarUrl || undefined} alt={user.fullName} />
            <AvatarFallback className="bg-muted text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>

          <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
            {text}, {user.fullName}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
          <MyTasksCard />
          <div className="flex flex-col gap-4">
            <TodaysMeetingsCard />
            <WorkspaceActivityCard />
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
