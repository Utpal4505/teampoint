import {
  MessagesSquare,
  MousePointerClick,
  RotateCcw,
  SquareKanban,
} from 'lucide-react'

const PAINS = [
  {
    icon: SquareKanban,
    title: 'Tasks are everywhere',
    text: 'The work exists, but it is split between boards, chats, docs, and memory.',
  },
  {
    icon: MessagesSquare,
    title: 'Discussions do not end',
    text: 'Teams talk for days, then still ask what was decided.',
  },
  {
    icon: RotateCcw,
    title: 'Meetings lose momentum',
    text: 'A good conversation happens, then action items disappear after the call.',
  },
  {
    icon: MousePointerClick,
    title: 'Tools need too much managing',
    text: 'Small teams should not need a process expert just to move work forward.',
  },
]

export function Problem() {
  return (
    <section
      id="product"
      className="landing-noise relative bg-white/[0.015] py-24"
    >
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase text-rose-300">
            The problem
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight tracking-normal text-foreground lg:text-5xl">
            Work should not feel this messy.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Jira and ClickUp can be powerful, but they often feel heavy for a
            small team still trying to find speed. TeamPoint starts from the
            opposite question: what does the team need to finish this week?
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PAINS.map(item => (
            <div
              key={item.title}
              className="landing-card-hover rounded-lg border border-white/10 bg-[#11151a] p-5"
            >
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-md bg-rose-400/10 text-rose-300">
                <item.icon size={18} />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
