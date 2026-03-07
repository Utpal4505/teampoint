import { ArrowRight, Video, PartyPopper } from 'lucide-react'
import Link from 'next/link'

interface Meeting {
  id: string
  time: string
  title: string
  attendees?: number
}

const MOCK_MEETINGS: Meeting[] = [
  { id: '1', time: '10:30', title: 'Product Sync', attendees: 5 },
  { id: '2', time: '14:00', title: 'Investor Call', attendees: 3 },
  { id: '3', time: '18:00', title: 'Dev Standup', attendees: 8 },
]

function getStatus(time: string): 'past' | 'soon' | 'upcoming' {
  const [h, m] = time.split(':').map(Number)
  const now = new Date()
  const diff = h * 60 + m - (now.getHours() * 60 + now.getMinutes())
  if (diff < 0) return 'past'
  if (diff <= 30) return 'soon'
  return 'upcoming'
}

export function TodaysMeetingsCard() {
  const meetings = MOCK_MEETINGS

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Video size={13} className="text-primary" />
          </div>
          <h2 className="font-display text-sm font-bold text-foreground">
            {' '}
            Today&apos;s Meetings
          </h2>
        </div>
        {meetings.length > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-[2px] font-sans text-[11px] text-primary">
            {meetings.length}
          </span>
        )}
      </div>

      {/* List */}
      <div className="flex flex-col px-2 pb-2">
        {meetings.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <PartyPopper size={20} className="text-muted-foreground" />
            <p className="font-sans text-xs text-muted-foreground">
              No meetings today 🎉
            </p>
          </div>
        ) : (
          meetings.map(m => {
            const status = getStatus(m.time)
            return (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-lg px-3 py-[9px]
                  transition-colors duration-100 hover:bg-accent"
              >
                <span
                  className={`w-10 shrink-0 font-mono text-xs font-medium
                  ${
                    status === 'past'
                      ? 'text-muted-foreground'
                      : status === 'soon'
                        ? 'text-[oklch(0.72_0.14_55)]'
                        : 'text-primary'
                  }`}
                >
                  {m.time}
                </span>
                <div
                  className={`h-[6px] w-[6px] shrink-0 rounded-full
                  ${
                    status === 'past'
                      ? 'bg-border'
                      : status === 'soon'
                        ? 'bg-[oklch(0.7_0.14_55)] shadow-[0_0_5px_oklch(0.7_0.14_55/0.6)]'
                        : 'bg-primary'
                  }`}
                />
                <span
                  className={`flex-1 font-sans text-sm
                  ${status === 'past' ? 'text-muted-foreground' : 'text-foreground'}`}
                >
                  {m.title}
                </span>
                {m.attendees && (
                  <span className="font-sans text-[11px] text-muted-foreground">
                    {m.attendees}p
                  </span>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-5 py-3">
        <Link
          href="/dashboard/workspace/meetings"
          className="flex items-center gap-2 font-sans text-xs
            text-muted-foreground transition-colors duration-150 hover:text-foreground"
        >
          View meetings <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  )
}
