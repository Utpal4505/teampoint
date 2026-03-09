import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { PRIORITY_OPTIONS } from "@/features/tasks/constants";
import type { Priority } from "@/features/tasks/types";

interface PrioritySelectProps {
  value: Priority;
  onChange: (value: Priority) => void;
}

export default function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const sel = PRIORITY_OPTIONS.find(p => p.value === value)!;

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex w-full items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm transition-all hover:bg-accent ${sel.color}`}
      >
        <sel.Icon size={13} />
        <span className="flex-1 text-left">{sel.label}</span>
        <ChevronDown size={13} className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute bottom-[calc(100%+4px)] left-0 right-0 z-50 overflow-hidden rounded-xl border border-border bg-card shadow-[0_-8px_32px_oklch(0_0_0/0.4)]">
          {PRIORITY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`flex w-full items-center gap-3 px-3 py-2.5 text-sm transition-colors ${opt.color} hover:${opt.activeBg} ${value === opt.value ? opt.activeBg : ""}`}
            >
              <opt.Icon size={13} />
              <span className="flex-1 text-left">{opt.label}</span>
              {value === opt.value && <Check size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}