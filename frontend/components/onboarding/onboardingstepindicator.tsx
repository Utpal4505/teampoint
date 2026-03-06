interface Step {
  label: string;
}

interface OnboardingStepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export function OnboardingStepIndicator({
  currentStep,
  steps,
}: OnboardingStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        const isLastAndActive = isActive && stepNum === steps.length;

        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              {/* Circle */}
              <div
                className={`
                  relative flex h-8 w-8 items-center justify-center rounded-full
                  font-[family-name:var(--body-family)] text-xs font-medium
                  transition-all duration-300
                  ${
                    isDone
                      ? "bg-[oklch(0.6_0.16_262)] text-[oklch(0.98_0_0)] shadow-[0_0_0_4px_oklch(0.6_0.16_262/0.15)]"
                      : isLastAndActive
                      ? "bg-[oklch(0.52_0.15_145)] text-[oklch(0.98_0_0)] shadow-[0_0_0_4px_oklch(0.52_0.15_145/0.25)]"
                      : isActive
                      ? "bg-[oklch(0.6_0.16_262)] text-[oklch(0.98_0_0)] shadow-[0_0_0_4px_oklch(0.6_0.16_262/0.2)]"
                      : "bg-[oklch(0.23_0.01_250)] text-[oklch(0.45_0_0)] border border-[oklch(0.3_0.01_250)]"
                  }
                `}
              >
                {isDone || isLastAndActive ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6l2.5 2.5L9.5 4"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>

              {/* Label */}
              <span
                className={`
                  font-[family-name:var(--body-family)] text-[11px] transition-colors duration-300
                  ${
                    isLastAndActive
                      ? "text-[oklch(0.6_0.12_145)]"
                      : isActive
                      ? "text-[oklch(0.78_0_0)]"
                      : isDone
                      ? "text-[oklch(0.55_0_0)]"
                      : "text-[oklch(0.38_0_0)]"
                  }
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {i < steps.length - 1 && (
              <div className="mb-5 mx-2 h-px w-12 overflow-hidden rounded-full bg-[oklch(0.25_0.01_250)]">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: isDone ? "100%" : "0%",
                    background: isDone ? "oklch(0.6 0.16 262)" : "transparent",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}