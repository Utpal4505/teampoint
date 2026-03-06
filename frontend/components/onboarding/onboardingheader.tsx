interface OnboardingHeaderProps {
  title: string
  subtitle?: string
}

export function OnboardingHeader({ title, subtitle }: OnboardingHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-[family-name:var(--display-family)] text-2xl font-bold tracking-tight text-primary-foreground">
        {title}
      </h1>
      {subtitle && (
        <p className="font-[family-name:var(--body-family)] text-sm leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  )
}
