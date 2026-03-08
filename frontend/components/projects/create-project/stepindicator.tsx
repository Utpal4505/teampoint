import { Check, Briefcase, Users } from 'lucide-react'

export function StepIndicator({ step }: { step: 1 | 2 }) {
  const steps = [
    { n: 1 as const, label: 'Details', Icon: Briefcase },
    { n: 2 as const, label: 'Members', Icon: Users },
  ]

  return (
    <div className="flex items-center gap-1">
      {steps.map(({ n, label }, i) => (
        <div key={n} className="flex items-center gap-1">
          <div
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1
            transition-all duration-300 ${step === n ? 'bg-primary/10' : ''}`}
          >
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full
              font-sans text-[10px] font-bold transition-all duration-300
              ${
                step === n
                  ? 'bg-primary text-primary-foreground shadow-[0_0_8px_oklch(0.6_0.16_262/0.5)]'
                  : step > n
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {step > n ? <Check size={10} /> : n}
            </div>
            <span
              className={`font-sans text-[11px] font-medium transition-colors duration-200
              ${step === n ? 'text-primary' : step > n ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}
            >
              {label}
            </span>
          </div>
          {i === 0 && (
            <div
              className={`h-px w-6 transition-all duration-500 ${step > 1 ? 'bg-primary/40' : 'bg-border'}`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
