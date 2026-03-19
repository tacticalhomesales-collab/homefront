
"use client";
import AppShell from "../../components/AppShell";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ChoiceButton from "../_components/ChoiceButton";

const TIMELINES = ["ASAP", "1-3 months", "3-6 months", "6+ months", "Just exploring"] as const;
const CREDIT_BANDS = ["Great (720+)", "Good (660-719)", "Fair (600-659)", "Needs work (<600)", "Prefer not to say"] as const;

export default function PreapprovalHelpPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [step, setStep] = useState<1 | 2>(1);
  const [timeline, setTimeline] = useState("");
  const [creditBand, setCreditBand] = useState("");

  const [pressed, setPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const getNextUrl = () => {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("timeline", timeline);
    q.set("credit_band", creditBand);

    // Route to match-preview (now review, identity already collected earlier in flow)
    return `/review?${q.toString()}`;
  };

  const onPickTimeline = (value: string) => {
    if (pressed) return;
    setActiveLabel(value);
    setPressed(true);
    setTimeline(value);

    setTimeout(() => {
      setPressed(false);
      setActiveLabel(null);
      setStep(2);
    }, 120);
  };

  const onPickCreditBand = (value: string) => {
    if (pressed) return;
    setActiveLabel(value);
    setPressed(true);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("timeline", timeline);
    q.set("credit_band", value);

    const href = `/review?${q.toString()}`;
    setTimeout(() => router.push(href), 120);
  };

  return (
    <AppShell>
      <div
        className="w-full max-w-md relative mx-auto text-center px-4 pt-0 pb-10"
        style={{ marginTop: "-0.75rem" }}
      >
        <div className="flex flex-col items-center justify-center pointer-events-none mb-2">
          <h1 className="text-2xl font-extrabold tracking-tight leading-none text-white mb-0.5">
            {step === 1 ? "Timeline" : "Credit Status"}
          </h1>
          <p className="mt-1 text-sm font-semibold text-white/70">
            {step === 1 ? "When are you looking to buy?" : "How's your credit?"}
          </p>
        </div>

        {/* Step 1: Timeline */}
        {step === 1 && (
          <div className="mt-1 relative z-50 flex flex-col gap-2 w-full items-center">
            {TIMELINES.map((t) => (
              <div key={t} className="w-full max-w-xs">
                <ChoiceButton
                  label={t}
                  active={activeLabel === t}
                  disabled={pressed}
                  onClick={() => onPickTimeline(t)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Credit Band */}
        {step === 2 && (
          <div className="mt-1 relative z-50 flex flex-col gap-2 w-full items-center">
            {CREDIT_BANDS.map((c) => (
              <div key={c} className="w-full max-w-xs">
                <ChoiceButton
                  label={c}
                  active={activeLabel === c}
                  disabled={pressed}
                  onClick={() => onPickCreditBand(c)}
                />
              </div>
            ))}
          </div>
        )}

        <p className="mt-5 text-[11px] text-white/45 text-center">
          Not affiliated with any government agency.
        </p>
      </div>
    </AppShell>
  );
}
