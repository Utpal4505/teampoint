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
        src="/logo-dot-teampoint.svg"
        alt={appName}
        width={48}
        height={48}
        className="mb-1 object-contain"
        priority
      />

      <Image
        src="/dark-text-teampoint.svg"
        alt={appName}
        width={120}
        height={30}
        className="object-contain"
        priority
      />

      <p className="font-body text-sm text-muted-foreground">{tagline}</p>
    </div>
  )
}