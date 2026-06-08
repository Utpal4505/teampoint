"use client";

import {
  useState,
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { AlertCircle } from "lucide-react";

interface BaseFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

// ── Input ─────────────────────────────────────────────────────
interface OnboardingInputProps
  extends BaseFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "required"> {}

export const OnboardingInput = forwardRef<HTMLInputElement, OnboardingInputProps>(
  ({ label, error, hint, required, className = "", ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 font-[family-name:var(--body-family)] text-sm text-accent-foreground">
          {label}
          {!required && (
            <span className="rounded-md bg-[oklch(0.25_0.01_250)] px-2 py-[2px] text-[10px] text-primary-foreground">
              optional
            </span>
          )}
        </label>

        <input
          ref={ref}
          {...props}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          className={`
            w-full rounded-xl px-4 py-4
            font-[family-name:var(--body-family)] text-sm
            text-[oklch(0.92_0_0)]
            placeholder:text-[oklch(0.38_0_0)]
            outline-none border
            transition-all duration-150
            ${
              hasError
                ? "border-[oklch(0.62_0.2_25/0.7)] bg-[oklch(0.22_0.005_15)] shadow-[0_0_0_3px_oklch(0.62_0.2_25/0.08)]"
                : focused
                ? "border-[oklch(0.6_0.16_262/0.7)] bg-[oklch(0.22_0.012_255)] shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.1)]"
                : "border-[oklch(0.28_0.01_250)] bg-[oklch(0.19_0.01_250)] hover:border-[oklch(0.33_0.01_250)] hover:bg-[oklch(0.21_0.01_250)]"
            }
            ${className}
          `}
        />

        {hasError ? (
          <p className="flex items-center gap-2 font-[family-name:var(--body-family)] text-xs text-[oklch(0.72_0.15_25)]">
            <AlertCircle size={12} className="shrink-0" />
            {error}
          </p>
        ) : hint ? (
          <p className="font-[family-name:var(--body-family)] text-xs leading-relaxed text-[oklch(0.42_0_0)]">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
OnboardingInput.displayName = "OnboardingInput";

// ── Textarea ──────────────────────────────────────────────────
interface OnboardingTextareaProps
  extends BaseFieldProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "required"> {}

export const OnboardingTextarea = forwardRef<HTMLTextAreaElement, OnboardingTextareaProps>(
  ({ label, error, hint, required, className = "", ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 font-[family-name:var(--body-family)] text-sm text-accent-foreground">
          {label}
          {!required && (
            <span className="rounded-md bg-[oklch(0.25_0.01_250)] px-2 py-[2px] text-[10px] text-primary-foreground">
              optional
            </span>
          )}
        </label>

        <textarea
          ref={ref}
          {...props}
          rows={props.rows ?? 3}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          className={`
            w-full resize-none rounded-xl px-4 py-4
            font-[family-name:var(--body-family)] text-sm
            text-[oklch(0.92_0_0)]
            placeholder:text-[oklch(0.38_0_0)]
            outline-none border
            transition-all duration-150
            ${
              hasError
                ? "border-[oklch(0.62_0.2_25/0.7)] bg-[oklch(0.22_0.005_15)] shadow-[0_0_0_3px_oklch(0.62_0.2_25/0.08)]"
                : focused
                ? "border-[oklch(0.6_0.16_262/0.7)] bg-[oklch(0.22_0.012_255)] shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.1)]"
                : "border-[oklch(0.28_0.01_250)] bg-[oklch(0.19_0.01_250)] hover:border-[oklch(0.33_0.01_250)] hover:bg-[oklch(0.21_0.01_250)]"
            }
            ${className}
          `}
        />

        {hasError ? (
          <p className="flex items-center gap-2 font-[family-name:var(--body-family)] text-xs text-[oklch(0.72_0.15_25)]">
            <AlertCircle size={12} className="shrink-0" />
            {error}
          </p>
        ) : hint ? (
          <p className="font-[family-name:var(--body-family)] text-xs leading-relaxed text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
OnboardingTextarea.displayName = "OnboardingTextarea";