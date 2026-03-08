import { AlertCircle } from 'lucide-react'

export function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="flex items-center gap-2 font-sans text-xs font-medium text-muted-foreground">
      {children}
      {!required && (
        <span className="rounded-md bg-muted px-[6px] py-[2px] text-[10px] font-normal text-muted-foreground/40">
          optional
        </span>
      )}
    </label>
  )
}

export function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="flex items-center gap-1.5 font-sans text-[11px] text-destructive">
      <AlertCircle size={10} className="shrink-0" /> {msg}
    </p>
  )
}
