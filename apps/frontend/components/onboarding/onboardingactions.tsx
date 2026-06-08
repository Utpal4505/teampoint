"use client";

import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";
import { ReactNode } from "react";

interface OnboardingActionsProps {
  onNext?: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  nextLabel?: ReactNode;
  skipLabel?: string;
  loading?: boolean;
  loadingLabel?: string;
  showBack?: boolean;
  showSkip?: boolean;
}

function BounceDots() {
  return (
    <span className="flex items-center gap-[3px]" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block h-[5px] w-[5px] rounded-full bg-current"
          style={{ animation: `ob-bd 1.1s ease-in-out ${i * 0.18}s infinite` }}
        />
      ))}
      <style>{`
        @keyframes ob-bd {
          0%,80%,100% { transform:translateY(0); opacity:0.3; }
          40%          { transform:translateY(-5px); opacity:1; }
        }
      `}</style>
    </span>
  );
}

export function OnboardingActions({
  onNext,
  onBack,
  onSkip,
  nextLabel = "Continue",
  skipLabel = "Skip",
  loading = false,
  loadingLabel = "Loading…",
  showBack = true,
  showSkip = false,
}: OnboardingActionsProps) {
  return (
    <div className="flex items-center gap-2">

      {showBack && (
        <button
          onClick={onBack}
          type="button"
          className="flex items-center gap-2 rounded-xl
            border border-[oklch(0.28_0.01_250)]
            bg-[oklch(0.2_0.01_250)] px-4 py-4
            font-[family-name:var(--body-family)] text-sm
            text-[oklch(0.52_0_0)]
            transition-all duration-150
            hover:border-[oklch(0.35_0.01_250)]
            hover:bg-[oklch(0.24_0.01_250)]
            hover:text-[oklch(0.78_0_0)]
            active:scale-[0.97]
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-[oklch(0.6_0.16_262)]"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      )}

      {showSkip && (
        <button
          onClick={onSkip}
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl
            border border-[oklch(0.28_0.01_250)]
            bg-transparent px-4 py-4
            font-[family-name:var(--body-family)] text-sm
            text-[oklch(0.48_0_0)]
            transition-all duration-150
            hover:border-[oklch(0.35_0.01_250)]
            hover:bg-[oklch(0.22_0.01_250)]
            hover:text-[oklch(0.68_0_0)]
            active:scale-[0.97]
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-[oklch(0.6_0.16_262)]"
        >
          <SkipForward size={13} className="opacity-60" />
          {skipLabel}
        </button>
      )}

      {!showSkip && <span className="flex-1" />}

      {/* Primary CTA → */}
      <button
        onClick={onNext}
        type="button"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-xl
          bg-[oklch(0.6_0.16_262)] px-6 py-4
          font-[family-name:var(--body-family)] text-sm font-medium
          text-[oklch(0.98_0_0)]
          shadow-[0_2px_16px_oklch(0.6_0.16_262/0.25)]
          transition-all duration-150
          hover:-translate-y-px hover:bg-[oklch(0.56_0.16_262)]
          hover:shadow-[0_6px_24px_oklch(0.6_0.16_262/0.4)]
          active:translate-y-0 active:scale-[0.99]
          disabled:cursor-not-allowed disabled:opacity-60
          disabled:hover:translate-y-0
          disabled:hover:shadow-[0_2px_16px_oklch(0.6_0.16_262/0.25)]
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-[oklch(0.6_0.16_262)]
          focus-visible:ring-offset-2
          focus-visible:ring-offset-[oklch(0.2_0.01_250)]"
      >
        {loading ? (
          <>
            <BounceDots />
            <span className="ml-1">{loadingLabel}</span>
          </>
        ) : (
          <>
            <span>{nextLabel}</span>
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </div>
  );
}