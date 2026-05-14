'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, FolderKanban } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { label: 'Product', href: '#product' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
  ]

  function handleMouseEnter(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = e.currentTarget
    const nav = navRef.current
    if (!nav) return
    const navRect = nav.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    setIndicatorStyle({
      left: elRect.left - navRect.left,
      width: elRect.width,
      opacity: 1,
    })
  }

  function handleMouseLeave() {
    setIndicatorStyle(s => ({ ...s, opacity: 0 }))
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#08080a]/90 backdrop-blur-md border-b border-white/[0.07]'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[oklch(0.6_0.18_262)] flex items-center justify-center">
            <FolderKanban size={14} className="text-white" />
          </div>
          <span className="font-['Syne'] font-bold text-white text-[15px] tracking-tight">
            TeamPoint
          </span>
        </Link>

        <nav
          ref={navRef}
          className="hidden md:flex items-center gap-1 relative"
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 h-8 rounded-lg bg-white/[0.06] transition-all duration-200 pointer-events-none"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              opacity: indicatorStyle.opacity,
            }}
          />
          {links.map(link => (
            <a
              key={link.label}
              href={link.href}
              onMouseEnter={handleMouseEnter}
              className="relative px-4 py-2 text-sm text-[#8a8a9a] hover:text-white transition-colors duration-150 rounded-lg"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm text-[#8a8a9a] hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="flex items-center gap-1.5 rounded-lg bg-[oklch(0.6_0.18_262)] px-4 py-2 text-sm font-semibold text-white hover:bg-[oklch(0.65_0.18_262)] transition-all shadow-[0_0_20px_oklch(0.6_0.18_262/0.3)]"
          >
            Get early access
          </Link>
        </div>

        <button
          className="md:hidden text-[#8a8a9a] hover:text-white"
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.07] bg-[#08080a]/95 backdrop-blur-md">
          <div className="px-6 py-4 flex flex-col gap-3">
            {links.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-[#8a8a9a] hover:text-white py-1"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/sign-up"
              className="mt-2 w-full text-center rounded-lg bg-[oklch(0.6_0.18_262)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Get early access
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
