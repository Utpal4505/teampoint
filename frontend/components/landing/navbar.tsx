'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, Target, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Flow', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    handler()
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition',
        scrolled
          ? 'border-white/10 bg-[#0b0d10]/90 backdrop-blur'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Target size={16} />
          </span>
          <span className="text-base font-bold text-foreground">
            TeamPoint
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-white/[0.04] hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <Link
            href="/login"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Get early access
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-muted-foreground md:hidden"
          onClick={() => setMenuOpen(open => !open)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#0b0d10]/96 px-6 py-4 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2">
            {LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              Get early access
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
