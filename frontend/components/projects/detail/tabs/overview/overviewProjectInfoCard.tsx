import { Calendar, Users, FileText, UserCircle2 } from 'lucide-react'

interface OverviewProjectInfoCardProps {
  ownerName: string | null
  createdAt: string
  memberCount: number
  documentCount: number
  description: string | null
}

export default function OverviewProjectInfoCard({
  ownerName,
  createdAt,
  memberCount,
  documentCount,
  description,
}: OverviewProjectInfoCardProps) {
  const rows = [
    { Icon: UserCircle2, label: 'Owner', value: ownerName ?? '—' },
    { Icon: Calendar, label: 'Created', value: createdAt },
    {
      Icon: Users,
      label: 'Team Size',
      value: `${memberCount} member${memberCount !== 1 ? 's' : ''}`,
    },
    {
      Icon: FileText,
      label: 'Documents',
      value: `${documentCount} file${documentCount !== 1 ? 's' : ''}`,
    },
  ]

  return (
    <div className="col-span-4 rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-4">
      <h3 className="text-sm font-bold text-foreground">Project Info</h3>

      <div className="flex flex-col gap-3">
        {rows.map(({ Icon, label, value }) => (
          <div key={label} className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/40 shrink-0">
              <Icon size={13} className="text-muted-foreground/60" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                {label}
              </p>
              <p className="text-xs font-medium text-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {description && (
        <div className="mt-auto pt-3 border-t border-border/40">
          <p className="text-[11px] text-muted-foreground/60 leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
      )}
    </div>
  )
}
