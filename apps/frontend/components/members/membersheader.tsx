'use client'



export default function MembersHeader() {
  return (
    <header
      className="sticky top-1.5 z-30 flex h-14 shrink-0 items-center border-b border-border
      bg-background/80 backdrop-blur-sm transition-[width,height] ease-linear
      group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
    >
      <div className="flex flex-1 items-center gap-3 px-6">
        <div className="flex-1">
          <h1 className="font-display text-lg font-bold tracking-tight text-foreground leading-none">
            Members
          </h1>
        </div>
      </div>
    </header>
  )
}
