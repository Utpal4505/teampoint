import Link from 'next/link'
import { FolderKanban } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-10">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
            <FolderKanban size={12} className="text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground text-sm">TeamPoint</span>
        </div>
        <p className="text-xs text-muted-foreground/60">© 2026 TeamPoint. All rights reserved.</p>
        <div className="flex items-center gap-5">
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <Link key={l} href="#" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  )
}