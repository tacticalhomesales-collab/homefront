"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const LENDER_TYPES = ["Bank", "Credit Union", "Mortgage Broker", "Online Lender", "Not sure / Unknown"] as const;
const RATE_BANDS = ["Under 6%", "6.0% - 6.49%", "6.5% - 6.99%", "7%+", "Unknown"] as const;
const CREDIT_BANDS = [
  "Great (720+)",
  "Good (660-719)",
  "Fair (600-659)",
  "Needs work (<600)",
  "Prefer not to say"
] as const;

export default function CompareLendersPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // If user is pre-approved and wants to compare lenders, start at credit status step
  const isPreApproved = sp.get("preapproved") === "true";
  const [step, setStep] = useState<1 | 2 | 3 | 4>(isPreApproved ? 4 : 1);
  const [lenderType, setLenderType] = useState("");
  const [rateBand, setRateBand] = useState("");
  const [creditBand, setCreditBand] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);

  const [pressed, setPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  // Priority options depend on loan_type (VA includes VA-specific option)
  const loanType = sp.get("loan_type") || "";
  const isVA = loanType.toLowerCase().includes("va");

  const PRIORITIES = [
    { label: "Best Rate", value: "rate" },
    { label: "Lowest Costs", value: "costs" },
    { label: "Fast Closing", value: "speed" },
    { label: "Communication", value: "comm" },
    ...(isVA ? [{ label: "VA Loan Expertise", value: "va" }] : []),
  ];

  const onPickLenderType = (value: string) => {
    if (pressed) return;
    setActiveLabel(value);
    setPressed(true);
    setLenderType(value);

    setTimeout(() => {
      setPressed(false);
      setActiveLabel(null);
      setStep(2);
    }, 120);
  };

  const onPickRateBand = (value: string) => {
    if (pressed) return;
    setActiveLabel(value);
    setPressed(true);
    setRateBand(value);

    setTimeout(() => {
      setPressed(false);
      setActiveLabel(null);
      setStep(3);
    }, 120);
  };

  const togglePriority = (value: string) => {
    if (pressed) return;

    if (priorities.includes(value)) {
      setPriorities(priorities.filter((v) => v !== value));
    } else {
      // Limit to 2
      if (priorities.length < 2) {
        setPriorities([...priorities, value]);
      } else {
        // Replace second one
        setPriorities([priorities[0], value]);
      }
    }
  };

  const onContinue = () => {
    if (pressed || priorities.length === 0) return;
    setPressed(true);
    setStep(4);
    setPressed(false);
  };

  const onPickCreditBand = (value: string) => {
    if (pressed) return;
    setActiveLabel(value);
    setPressed(true);
    setCreditBand(value);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("current_lender_type", lenderType);
    q.set("current_rate_band", rateBand);
    q.set("compare_priority", priorities.join(","));
    q.set("credit_band", value);

    const href = `/review?${q.toString()}`;
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

  const PriorityButton = ({ label, value }: { label: string; value: string }) => {
    const isSelected = priorities.includes(value);

    return (
      <button
        type="button"
        disabled={pressed}
        onClick={() => togglePriority(value)}
        className={[
          "cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl",
          "text-[21px] font-extrabold active:scale-[0.99] transition",
          "select-none touch-manipulation",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
          isSelected
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
              alt="HomeFront Logo"
              className="w-full h-auto scale-200 origin-center"
              draggable={false}
            />
          </div>

          {/* Title */}
          <div className="-mt-6 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-4xl font-extrabold tracking-tight leading-none text-white">
              {step === 1 && "Current Lender"}
              {step === 2 && "Current Rate"}
              {step === 3 && "Top Priorities"}
              {step === 4 && "Credit Status"}
            </h1>
            <p className="mt-3 text-sm font-semibold text-white/70">
              {step === 1 && "What type of lender do you have?"}
              {step === 2 && "What's your approximate rate?"}
              {step === 3 && "Pick your top 2 priorities"}
              {step === 4 && "How's your credit?"}
            </p>
          </div>

          {/* Step 1: Lender Type */}
          {step === 1 && (
            <div className="mt-2 relative z-50 flex flex-col gap-3">
              {LENDER_TYPES.map((type) => (
                <ChoiceButton key={type} label={type} onClick={() => onPickLenderType(type)} />
              ))}
            </div>
          )}

          {/* Step 2: Rate Band */}
          {step === 2 && (
            <div className="mt-2 relative z-50 flex flex-col gap-3">
              {RATE_BANDS.map((band) => (
                <ChoiceButton key={band} label={band} onClick={() => onPickRateBand(band)} />
              ))}
            </div>
          )}

          {/* Step 3: Priorities */}
          {step === 3 && (
            <>
              <div className="mt-2 relative z-50 flex flex-col gap-3">
                {PRIORITIES.map((p) => (
                  <PriorityButton key={p.value} label={p.label} value={p.value} />
                ))}
              </div>

              {/* Continue Button */}
              <div className="mt-5 w-[calc(100%+2.5rem)] -mx-5">
                <button
                  type="button"
                  disabled={priorities.length === 0 || pressed}
                  onClick={onContinue}
                  className={[
                    "w-full py-4 rounded-2xl text-[21px] font-extrabold transition active:scale-[0.99]",
                    "select-none touch-manipulation",
                    "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                    priorities.length === 0 || pressed
                      ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                      : "border border-white/15 bg-white/10 text-white hover:bg-white/15 cursor-pointer",
                  ].join(" ")}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Step 4: Credit Band */}
          {step === 4 && (
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
