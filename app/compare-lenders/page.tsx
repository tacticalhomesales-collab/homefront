
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AppShell from "../../components/AppShell";
import ChoiceButton from "../_components/ChoiceButton";
import PriorityButton from "../_components/PriorityButton";

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
  const isPreApproved = sp.get("preapproved") === "true";
  const [step, setStep] = useState<1 | 2 | 3 | 4>(isPreApproved ? 4 : 1);
  const [lenderType, setLenderType] = useState("");
  const [rateBand, setRateBand] = useState("");
  const [creditBand, setCreditBand] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [pressed, setPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

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
      if (priorities.length < 2) {
        setPriorities([...priorities, value]);
      } else {
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
  };
    return (
      <AppShell>
        <div className="w-full max-w-md relative mx-auto text-center px-4 pt-8 pb-10">
          {/* Title */}
          <div className="flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-4xl font-extrabold tracking-tight leading-none text-white">
              {step === 1 && "Current Lender"}
              {step === 2 && "Current Rate"}
              {step === 3 && "Top Priorities"}
              {step === 4 && "Credit Status"}
            </h1>
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
                  <PriorityButton
                    key={p.value}
                    label={p.label}
                    value={p.value}
                    active={priorities.includes(p.value)}
                    disabled={pressed}
                    onClick={togglePriority}
                  />
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
      </AppShell>
    );
}
