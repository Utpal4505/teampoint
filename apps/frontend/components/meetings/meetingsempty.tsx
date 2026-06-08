import { Video, Calendar } from 'lucide-react'

export default function MeetingsEmpty() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="flex flex-col items-center gap-6 max-w-sm">
        {/* Icon Container with Gradient Background */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 blur-xl rounded-full w-32 h-32" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10">
            <Video size={48} className="text-primary/60" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl font-bold text-foreground">
            No meetings scheduled
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
            Once you create meetings in your projects, they&apos;ll appear here. Start by
            creating your first meeting to get organized.
          </p>
        </div>

        {/* Secondary Action */}
        <div className="pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/10 text-xs text-primary/70">
            <Calendar size={14} />
            Create a meeting in your projects to get started
          </div>
        </div>
      </div>
    </div>
  )
}
