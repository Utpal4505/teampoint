'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2, Plug, Unplug } from 'lucide-react'

// ── Icons ──────────────────────────────────────────────────
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function SlackIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z"
        fill="#E01E5A"
      />
      <path
        d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
        fill="#E01E5A"
      />
      <path
        d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z"
        fill="#36C5F0"
      />
      <path
        d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
        fill="#36C5F0"
      />
      <path
        d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z"
        fill="#2EB67D"
      />
      <path
        d="M17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
        fill="#2EB67D"
      />
      <path
        d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52z"
        fill="#ECB22E"
      />
      <path
        d="M15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
        fill="#ECB22E"
      />
    </svg>
  )
}

function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-foreground/80"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

// ── Types ──────────────────────────────────────────────────
interface Integration {
  id: string
  name: string
  Icon: React.ComponentType<{ size?: number }>
  connected: boolean
  account?: string
  comingSoon?: boolean
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'google',
    name: 'Google',
    Icon: GoogleIcon,
    connected: true,
    account: 'utpal@gmail.com',
  },
  {
    id: 'slack',
    name: 'Slack',
    Icon: SlackIcon,
    connected: false,
    comingSoon: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    Icon: GithubIcon,
    connected: false,
    comingSoon: true,
  },
]

// ── Card ───────────────────────────────────────────────────
function IntegrationCard({ integration }: { integration: Integration }) {
  const [connected, setConnected] = useState(integration.connected)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    if (integration.comingSoon) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setConnected(v => !v)
    setLoading(false)
  }

  return (
    <div
      className={`flex flex-col gap-3 p-4 rounded-xl border transition-colors duration-100
      ${
        integration.comingSoon
          ? 'border-border/30 bg-muted/5 opacity-60'
          : connected
            ? 'border-border/50 bg-card hover:border-border/70'
            : 'border-border/40 bg-card hover:border-border/60'
      }`}
    >
      {/* Top row: icon + name + status badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center
            rounded-lg border border-border/50 bg-muted/20"
          >
            <integration.Icon size={18} />
          </div>

          {/* Name + status */}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-medium text-foreground">
                {integration.name}
              </p>
              {integration.comingSoon && (
                <span
                  className="text-[9px] font-bold uppercase tracking-wider
                  px-1.5 py-0.5 rounded-full bg-muted/40 text-muted-foreground/50
                  border border-border/30"
                >
                  Soon
                </span>
              )}
            </div>
            {connected && integration.account ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400/80 mt-0.5">
                <CheckCircle2 size={10} />
                {integration.account}
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground/40 mt-0.5 block">
                {integration.comingSoon ? 'Coming soon' : 'Not connected'}
              </span>
            )}
          </div>
        </div>

        {/* Action button */}
        {!integration.comingSoon && (
          <button
            onClick={toggle}
            disabled={loading}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5
              text-[11px] font-semibold shrink-0 transition-colors duration-100
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                connected
                  ? 'border-border/50 text-muted-foreground/70 hover:bg-red-500/8 hover:text-red-400 hover:border-red-500/20'
                  : 'border-primary/30 bg-primary/8 text-primary hover:bg-primary/15'
              }`}
          >
            {loading ? (
              <Loader2 size={10} className="animate-spin" />
            ) : connected ? (
              <>
                <Unplug size={10} /> Disconnect
              </>
            ) : (
              <>
                <Plug size={10} /> Connect
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────
export default function IntegrationPanel() {
  return (
    <div className="flex flex-col gap-2 p-5">
      {INTEGRATIONS.map(integration => (
        <IntegrationCard key={integration.id} integration={integration} />
      ))}
    </div>
  )
}
