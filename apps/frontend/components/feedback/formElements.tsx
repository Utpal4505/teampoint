
export function Label({
  children,
  required,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
      {children}
      {required && (
        <span className="text-destructive ml-0.5 normal-case tracking-normal">*</span>
      )}
    </label>
  )
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-destructive">
      <span className="inline-block h-1 w-1 rounded-full bg-destructive shrink-0" />
      {message}
    </p>
  )
}

export function Input({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5
        text-sm text-foreground placeholder:text-muted-foreground/40
        focus:outline-none focus:border-ring focus:bg-background focus:ring-2 focus:ring-ring/20
        transition-all duration-150 ${className}`}
    />
  )
}

export function Textarea({
  className = '',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5
        text-sm text-foreground placeholder:text-muted-foreground/40 resize-none
        focus:outline-none focus:border-ring focus:bg-background focus:ring-2 focus:ring-ring/20
        transition-all duration-150 ${className}`}
    />
  )
}
