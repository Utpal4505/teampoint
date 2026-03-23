interface SettingsSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  danger?: boolean
}

export default function SettingsSection({
  title,
  description,
  children,
  danger,
}: SettingsSectionProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-0.5 px-1">
        <h2
          className={`text-[13px] font-semibold
          ${danger ? 'text-red-400/90' : 'text-foreground/80'}`}
        >
          {title}
        </h2>
        {description && (
          <p className="text-[12px] text-muted-foreground/45 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div
        className={`rounded-xl border px-5
        ${danger ? 'border-red-500/12 bg-card' : 'border-border/50 bg-card'}`}
      >
        {children}
      </div>
    </div>
  )
}
