import { LayoutGrid, BarChart2, FileText, Users } from 'lucide-react'
import type { TabKey } from './projectdetailpage'

const TABS: { key: TabKey; label: string; Icon: React.ElementType }[] = [
  { key: 'tasks',     label: 'Tasks',     Icon: LayoutGrid },
  { key: 'overview',  label: 'Overview',  Icon: BarChart2  },
  { key: 'documents', label: 'Documents', Icon: FileText   },
  { key: 'members',   label: 'Members',   Icon: Users      },
]

interface ProjectTabsProps {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
  counts?: Partial<Record<TabKey, number>>
}

export default function ProjectTabs({
  activeTab,
  onTabChange,
  counts,
}: ProjectTabsProps) {
  return (
    <div className="flex items-center gap-0.5 px-4 border-t border-border/40 bg-background/60">
      {TABS.map(({ key, label, Icon }) => {
        const isActive = activeTab === key
        const count = counts?.[key]

        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`
              relative flex items-center gap-2 px-3.5 py-3 text-xs font-medium
              transition-all duration-200 rounded-t-lg group
              ${isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground/80'
              }
            `}
          >
            {/* Icon */}
            <Icon
              size={13}
              className={`shrink-0 transition-colors duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground/60 group-hover:text-muted-foreground'
              }`}
            />

            {/* Label */}
            <span className="tracking-wide">{label}</span>

            {/* Optional count badge */}
            {count !== undefined && count > 0 && (
              <span
                className={`flex h-4 min-w-4 items-center justify-center rounded-full
                  px-1 text-[9px] font-bold tabular-nums transition-colors duration-200
                  ${isActive
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground/60 group-hover:bg-muted/80'
                  }`}
              >
                {count}
              </span>
            )}

            {/* Active indicator — glowing bottom border */}
            {isActive && (
              <span
                className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, oklch(0.55 0.18 262), oklch(0.65 0.16 262))',
                  boxShadow: '0 0 6px oklch(0.6 0.16 262 / 0.6)',
                }}
              />
            )}

            {/* Hover fill — only for inactive */}
            {!isActive && (
              <span
                className="absolute inset-0 rounded-t-lg opacity-0 group-hover:opacity-100
                  transition-opacity duration-200 bg-accent/40"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}