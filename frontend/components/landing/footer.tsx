import Link from 'next/link'
import { FolderKanban } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-[oklch(0.6_0.18_262)] flex items-center justify-center">
            <FolderKanban size={12} className="text-white" />
          </div>
          <span className="font-['Syne'] font-bold text-white text-sm">TeamPoint</span>
        </div>
        <p className="text-xs text-[#55556a]">© 2026 TeamPoint. All rights reserved.</p>
        <div className="flex items-center gap-5">
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <Link key={l} href="#" className="text-xs text-[#55556a] hover:text-[#8a8a9a] transition-colors">{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  )
}