import Link from 'next/link'
import { Target } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center md:flex-row md:text-left">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Target size={14} />
          </div>
          <span className="text-sm font-bold text-foreground">TeamPoint</span>
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; 2026 TeamPoint. Built for focused teams.
        </p>

        <div className="flex items-center gap-5">
          {['Privacy', 'Terms', 'Contact'].map(label => (
            <Link
              key={label}
              href="#"
              className="text-xs text-muted-foreground transition hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
