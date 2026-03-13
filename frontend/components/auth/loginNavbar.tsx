import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

export function LoginNavbar() {
  return (
    <nav className="absolute top-0 inset-x-0 z-10 flex items-center justify-end px-6 py-4">
      <Link
        href="/feedback"
        className="flex items-center gap-2 rounded-xl border border-border bg-card/60
          backdrop-blur-sm px-3.5 py-2 text-xs font-medium text-muted-foreground
          hover:bg-accent hover:text-foreground transition-all duration-150"
      >
        <MessageSquare size={13} />
        Feedback
      </Link>
    </nav>
  )
}
