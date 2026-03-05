interface AuthLogoProps {
  appName?: string
  tagline?: string
}

export function AuthLogo({
  appName = 'TeamPoint',
  tagline = 'Calm workspace for teams',
}: AuthLogoProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="
          mb-2 flex h-12 w-12 items-center justify-center rounded-2xl
          bg-primary
          shadow-[0_4px_24px_oklch(0.6_0.16_262/0.4)]
        "
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="7.5" cy="7.5" r="3" fill="white" fillOpacity="0.95" />
          <circle cx="16.5" cy="7.5" r="3" fill="white" fillOpacity="0.55" />
          <circle cx="7.5" cy="16.5" r="3" fill="white" fillOpacity="0.55" />
          <circle cx="16.5" cy="16.5" r="3" fill="white" fillOpacity="0.25" />
        </svg>
      </div>

      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
        {appName}
      </h1>

      <p className="font-body text-sm text-muted-foreground">{tagline}</p>
    </div>
  )
}
