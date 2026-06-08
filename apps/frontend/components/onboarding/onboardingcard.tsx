import { ReactNode } from "react";

interface OnboardingCardProps {
  children: ReactNode;
}

export function OnboardingCard({ children }: OnboardingCardProps) {
  return (
    <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[oklch(0.28_0.01_250)] bg-[oklch(0.2_0.01_250)] p-8 shadow-[0_8px_48px_oklch(0_0_0/0.4),inset_0_1px_0_oklch(1_0_0/0.04)]">
      {/* Top shimmer */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 10%, oklch(0.6 0.16 262 / 0.45) 50%, transparent 90%)",
        }}
      />
      {children}
    </div>
  );
}