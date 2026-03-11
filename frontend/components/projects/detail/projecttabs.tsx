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
}

export default function ProjectTabs({ activeTab, onTabChange }: ProjectTabsProps) {
  return (
    <div className="flex items-center gap-1 px-6 border-t border-border/40">
      {TABS.map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-medium
            transition-all duration-150
            ${
              activeTab === key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
        >
          <Icon size={13} />
          {label}
        </button>
      ))}
    </div>
  )
}