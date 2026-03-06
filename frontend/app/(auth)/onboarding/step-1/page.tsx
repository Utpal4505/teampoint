"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthBackground } from "@/components/auth";
import {
  OnboardingActions,
  OnboardingCard,
  OnboardingHeader,
  OnboardingInput,
  OnboardingStepIndicator,
  OnboardingTextarea,
} from "@/components/onboarding";

const STEPS = [
  { label: "Workspace" },
  { label: "Invite" },
  { label: "Done" },
];

interface FormState { name: string; description: string; }
interface FormErrors { name?: string; }

export default function OnboardingStep1() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ name: "", description: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Workspace name cannot be empty";
    else if (form.name.trim().length < 2) e.name = "Must be at least 2 characters";
    setErrors(e);
    return !e.name;
  }

  async function handleNext() {
    if (!validate()) return;
    setLoading(true);
    // await createWorkspace({ name: form.name, description: form.description })
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    router.push("/onboarding/step-2");
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[oklch(0.16_0.005_260)] p-8">
      <AuthBackground />
      <div className="relative z-10 flex w-full flex-col items-center gap-8">
        <OnboardingCard>
          <div className="flex flex-col gap-8">
            <OnboardingStepIndicator currentStep={1} steps={STEPS} />

            <OnboardingHeader
              title="Welcome to TeamPoint!"
              subtitle="Let's set up your workspace first — you can always change this later."
            />

            <div className="flex flex-col gap-6">
              <OnboardingInput
                label="Workspace Name"
                required
                placeholder="e.g. Acme Corp, Dev Squad…"
                value={form.name}
                error={errors.name}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value }));
                  if (errors.name) setErrors({});
                }}
              />
              <OnboardingTextarea
                label="Description"
                placeholder="Describe your workspace, e.g. Marketing Team, Dev Squad…"
                value={form.description}
                hint="Helps teammates understand the purpose of this workspace."
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>

            <OnboardingActions
              onNext={handleNext}
              nextLabel="Create Workspace"
              loading={loading}
              loadingLabel="Creating…"
              showBack={false}
            />
          </div>
        </OnboardingCard>
      </div>
    </main>
  );
}