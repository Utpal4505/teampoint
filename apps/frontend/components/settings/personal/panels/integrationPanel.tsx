'use client'

import { CheckCircle2, Loader2, Plug, Unplug } from 'lucide-react'
import { useWorkspaceId } from '@/hooks/useworkspaceid'
import {
  useListIntegrations,
  useInitiateIntegration,
  useDisconnectIntegration,
} from '@/features/integration/hooks'
import type { IntegrationProvider } from '@/features/integration/types'

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

// function GithubIcon({ size = 20 }: { size?: number }) {
//   return (
//     <svg
//       width={size}
//       height={size}
//       viewBox="0 0 24 24"
//       fill="currentColor"
//       className="text-foreground/80"
//     >
//       <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
//     </svg>
//   )
// }

// ── Types ──────────────────────────────────────────────────
interface IntegrationConfig {
  provider: IntegrationProvider
  name: string
  Icon: React.ComponentType<{ size?: number }>
  color: string
}

const INTEGRATION_CONFIG: Record<IntegrationProvider, IntegrationConfig> = {
  GOOGLE: {
    provider: 'GOOGLE',
    name: 'Google',
    Icon: GoogleIcon,
    color: '#4285F4',
  },
  // GITHUB: {
  //   provider: 'GITHUB',
  //   name: 'GitHub',
  //   Icon: GithubIcon,
  //   color: '#000000',
  // },
}

// ── Card ───────────────────────────────────────────────────
function IntegrationCard({
  config,
  connected,
  connectedAt,
  workspaceId,
}: {
  config: IntegrationConfig
  connected: boolean
  connectedAt: Date | null
  workspaceId: number
}) {
  const initiate = useInitiateIntegration()
  const disconnect = useDisconnectIntegration()

  async function handleConnect() {
    initiate.mutate({ provider: config.provider, workspaceId })
  }

  async function handleDisconnect() {
    disconnect.mutate(config.provider)
  }

  const isLoading = initiate.isPending || disconnect.isPending

  return (
    <div
      className={`flex flex-col gap-3 p-4 rounded-xl border transition-colors duration-100
      ${
        connected
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
            <config.Icon size={18} />
          </div>

          {/* Name + status */}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-medium text-foreground">{config.name}</p>
            </div>
            {connected && connectedAt ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400/80 mt-0.5">
                <CheckCircle2 size={10} />
                Connected {new Date(connectedAt).toLocaleDateString()}
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground/40 mt-0.5 block">
                Not connected
              </span>
            )}
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={connected ? handleDisconnect : handleConnect}
          disabled={isLoading}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5
            text-[11px] font-semibold shrink-0 transition-colors duration-100
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              connected
                ? 'border-border/50 text-muted-foreground/70 hover:bg-red-500/8 hover:text-red-400 hover:border-red-500/20'
                : 'border-primary/30 bg-primary/8 text-primary hover:bg-primary/15'
            }`}
        >
          {isLoading ? (
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
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────
export default function IntegrationPanel() {
  const workspaceId = useWorkspaceId()
  const { data, isLoading } = useListIntegrations()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    )
  }

  const connectedProviders = new Set(data?.data?.map(i => i.provider) ?? [])
  const connectedCount = connectedProviders.size
  const totalCount = Object.keys(INTEGRATION_CONFIG).length

  return (
    <div className="flex flex-col gap-2 p-5">
      {Object.values(INTEGRATION_CONFIG).map(config => (
        <IntegrationCard
          key={config.provider}
          config={config}
          connected={connectedProviders.has(config.provider)}
          connectedAt={
            data?.data?.find(i => i.provider === config.provider)?.connectedAt ?? null
          }
          workspaceId={workspaceId}
        />
      ))}

      {/* Summary line */}
      <p className="text-[11px] text-muted-foreground/50 mt-1 px-0.5">
        {connectedCount === 0
          ? 'No integrations connected'
          : `${connectedCount} of ${totalCount} connected`}
      </p>
    </div>
  )
}
