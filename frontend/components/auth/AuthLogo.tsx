import Image from 'next/image'

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
      <Image
        src="/favicon.png"
        alt={appName}
        width={48}
        height={48}
        className="mb-2 object-contain"
        priority
      />

      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
        {appName}
      </h1>

      <p className="font-body text-sm text-muted-foreground">{tagline}</p>
    </div>
  )
}
