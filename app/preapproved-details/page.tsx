
"use client";
import AppShell from "../../components/AppShell";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ChoiceButton from "../_components/ChoiceButton";

const LOAN_TYPES = ["Conventional", "FHA", "VA", "Other", "Not sure"] as const;
const BUDGET_RANGES = [
  "Under $200K",
  "$200K-$400K",
  "$400K-$600K",
  "$600K-$800K",
  "$800K-$1M",
  "Over $1M",
] as const;

export default function PreapprovedDetailsPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loanType, setLoanType] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [shopLenders, setShopLenders] = useState("");

  const [pressed, setPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const getNextUrl = () => {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("loan_type", loanType);
    q.set("budget_range", budgetRange);
    q.set("shop_lenders", shopLenders);
    const mission = (sp.get("mission") || "").toLowerCase();

    // For buy flows, always ask a timeline question after preapproval details
    if (mission === "buy") {
      const next = shopLenders === "yes" ? "compare-lenders" : "review";
      return `/buy-timeline?next=${next}&${q.toString()}`;
    }

    // Non-buy flows keep existing behavior
    if (shopLenders === "yes") {
      return `/compare-lenders?${q.toString()}`;
    }

    return `/review?${q.toString()}`;
  };

  const onPickLoanType = (value: string) => {
    if (pressed) return;
    setActiveLabel(value);
    setPressed(true);
    setLoanType(value);

    setTimeout(() => {
      setPressed(false);
      setActiveLabel(null);
      setStep(2);
    }, 120);
  };

  const onPickBudget = (value: string) => {
    if (pressed) return;
    setActiveLabel(value);
    setPressed(true);
    setBudgetRange(value);

    setTimeout(() => {
      setPressed(false);
      setActiveLabel(null);
      setStep(3);
    }, 120);
  };

  const onPickShopLenders = (value: string) => {
    if (pressed) return;
    setActiveLabel(value);
    setPressed(true);
    setShopLenders(value);

    const href = getNextUrl();
    setTimeout(() => router.push(href), 120);
  };

  const GridButton = ({ label, onClick }: { label: string; onClick: () => void }) => {
    const isActive = activeLabel === label;

    return (
      <button
        type="button"
        disabled={pressed}
        onClick={onClick}
        className={[
          "w-full py-2 rounded-xl text-[13px] font-extrabold transition active:scale-[0.99]",
          "select-none touch-manipulation",
          isActive
            ? "bg-[#ff385c] text-white cursor-not-allowed shadow-[0_10px_30px_rgba(255,56,92,0.25)]"
            : pressed
            ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
            : "border border-white/15 bg-white/10 text-white hover:bg-white/15 cursor-pointer",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  return (
    <AppShell>
      <div className="w-full max-w-md relative mx-auto text-center px-4 pt-0 pb-10">
        {/* Invisible spacer row */}
        <div className="mb-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[14px] font-extrabold tracking-[-0.02em] text-white/80 opacity-0 pointer-events-none select-none">
          <span>Buy</span>
          <span className="text-white/25">•</span>
          <span>Sell</span>
          <span className="text-white/25">•</span>
          <span>Rent</span>
          <span className="text-white/25">•</span>
          <span>Manage</span>
        </div>

        {/* Title - changes based on step */}
        <div className="-mt-4 flex flex-col items-center justify-center pointer-events-none">
          <h1 className="text-2xl font-extrabold tracking-tight leading-none text-white mb-0.5">
            {step === 1 && "Loan Type"}
            {step === 2 && "Budget Range"}
            {step === 3 && "Compare Lenders"}
          </h1>
          <p className="mt-1 text-xs font-semibold text-white/70">
            {step === 1 && "What type of loan are you pre-approved for?"}
            {step === 2 && "What's your approximate budget?"}
            {step === 3 && "Want to compare lenders?"}
          </p>
        </div>

        {/* Step 1: Loan Type */}
        {step === 1 && (
          <div className="mt-1 relative z-50 flex flex-col gap-2 items-center">
            {LOAN_TYPES.map((type) => (
              <div key={type} className="w-full max-w-xs">
                <ChoiceButton
                  label={type}
                  active={activeLabel === type}
                  disabled={pressed}
                  onClick={() => onPickLoanType(type)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Budget Range */}
        {step === 2 && (
          <div className="mt-1 relative z-50">
            <div className="grid grid-cols-2 gap-2">
              {BUDGET_RANGES.map((range) => (
                <GridButton key={range} label={range} onClick={() => onPickBudget(range)} />
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Shop Lenders */}
        {step === 3 && (
          <div className="mt-1 relative z-50 flex flex-col gap-2 items-center">
            <div className="w-full max-w-xs">
              <ChoiceButton
                label="Yes, compare options"
                active={activeLabel === "yes"}
                disabled={pressed}
                onClick={() => onPickShopLenders("yes")}
              />
            </div>
            <div className="w-full max-w-xs">
              <ChoiceButton
                label="No, I'm all set"
                active={activeLabel === "no"}
                disabled={pressed}
                onClick={() => onPickShopLenders("no")}
              />
            </div>
          </div>
        )}

        <p className="mt-3 text-[10px] text-white/45 text-center">
          Not affiliated with any government agency.
        </p>
      </div>
    </AppShell>
  );
}
