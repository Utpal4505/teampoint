'use client'

import Link from 'next/link'

const TABS = [
  { key: 'personal', label: 'Personal' },
  { key: 'workspace', label: 'Workspace' },
]

interface SettingsTabBarProps {
  activeTab: string
  workspaceId: string
}

export default function SettingsTabBar({ activeTab, workspaceId }: SettingsTabBarProps) {
  return (
    <div className="border-b border-border/40 bg-background/60">
      <div className="mx-auto max-w-xl px-6 flex items-center gap-0">
        {TABS.map(t => {
          const isActive = activeTab === t.key
          return (
            <Link
              key={t.key}
              href={`/workspace/${workspaceId}/settings/${t.key}`}
              className={`relative px-1 py-3 mr-6 text-sm font-medium
                transition-colors duration-100
                ${
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {t.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
