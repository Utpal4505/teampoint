interface AuthFooterLink {
  label: string
  href: string
}

interface AuthFooterProps {
  hint?: string
  links?: AuthFooterLink[]
}

const defaultLinks: AuthFooterLink[] = [
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Help', href: '/help' },
]

export function AuthFooter({
  hint = 'Get started in seconds',
  links = defaultLinks,
}: AuthFooterProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="font-body text-xs text-muted-foreground">{hint}</p>

      <div className="flex items-center gap-2">
        {links.map((link, i) => (
          <span key={link.href} className="flex items-center gap-2">
            <a
              href={link.href}
              className="
                font-body text-xs
                text-muted-foreground
                transition-colors duration-150
                hover:text-foreground
              "
            >
              {link.label}
            </a>

            {i < links.length - 1 && <span className="text-xs text-border">•</span>}
          </span>
        ))}
      </div>
    </div>
  )
}
