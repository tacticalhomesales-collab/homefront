"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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

    // Route to match-preview (identity already collected earlier in flow)
    return `/match-preview?${q.toString()}`;
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

    const href = `/match-preview?${q.toString()}`;
    setTimeout(() => router.push(href), 120);
  };

  const ChoiceButton = ({ label, onClick }: { label: string; onClick: () => void }) => {
    const isActive = activeLabel === label;

    return (
      <button
        type="button"
        disabled={pressed}
        onClick={onClick}
        className={[
          "cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl",
          "text-[21px] font-extrabold active:scale-[0.99] transition",
          "select-none touch-manipulation",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
          isActive
            ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]"
            : pressed
            ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
            : "border border-white/15 bg-white/10 text-white hover:bg-white/15",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  return (
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4">
      <div className="min-h-[100dvh] flex flex-col items-center text-center pt-8 pb-10">
        <div className="w-full max-w-md relative">
          {/* Invisible spacer row */}
          <div className="mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[18px] font-extrabold tracking-[-0.02em] text-white/80 opacity-0 pointer-events-none select-none">
            <span>Buy</span>
            <span className="text-white/25">•</span>
            <span>Sell</span>
            <span className="text-white/25">•</span>
            <span>Rent</span>
            <span className="text-white/25">•</span>
            <span>Manage</span>
          </div>

          {/* Logo */}
          <div className="mx-auto w-full max-w-[95vw] mt-16 pointer-events-none select-none">
            <img
              src="/homefront-badge.png"
              alt="HomeFront"
              className="w-full h-auto scale-200 origin-center"
              draggable={false}
            />
          </div>

          {/* Title - changes based on step */}
          <div className="-mt-6 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-4xl font-extrabold tracking-tight leading-none text-white">
              {step === 1 ? "Timeline" : "Credit Status"}
            </h1>
            <p className="mt-3 text-sm font-semibold text-white/70">
              {step === 1 ? "When are you looking to buy?" : "How's your credit?"}
            </p>
          </div>

          {/* Step 1: Timeline */}
          {step === 1 && (
            <div className="mt-2 relative z-50 flex flex-col gap-3">
              {TIMELINES.map((t) => (
                <ChoiceButton key={t} label={t} onClick={() => onPickTimeline(t)} />
              ))}
            </div>
          )}

          {/* Step 2: Credit Band */}
          {step === 2 && (
            <div className="mt-2 relative z-50 flex flex-col gap-3">
              {CREDIT_BANDS.map((c) => (
                <ChoiceButton key={c} label={c} onClick={() => onPickCreditBand(c)} />
              ))}
            </div>
          )}

          <p className="mt-5 text-[11px] text-white/45">
            Not affiliated with any government agency.
          </p>
        </div>
      </div>
    </main>
  );
}
