
"use client";

import AppShell from "../../components/AppShell";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ChoiceButton from "../_components/ChoiceButton";

const OPTIONS = [
  { label: "Pre-approved", value: "preapproved" },
  { label: "Need help getting pre-approved", value: "need_help" },
  { label: "Talked to lender, not ready yet", value: "talked_to_lender" },
  { label: "Paying cash", value: "cash" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
] as const;

export default function FinancingStatusPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pressed, setPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const getNextUrl = (value: string) => {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("financing", value);

    // Route based on selection
    if (value === "preapproved") {
      return `/preapproved-details?${q.toString()}`;
    }
    if (value === "need_help") {
      return `/preapproval-help?${q.toString()}`;
    }
    // For other options, ensure buy flows still answer a timeline question
    const mission = (sp.get("mission") || "").toLowerCase();
    if (mission === "buy") {
      return `/buy-timeline?next=review&${q.toString()}`;
    }

    // Non-buy flows keep existing behavior: go straight to review
    return `/review?${q.toString()}`;
  };

  const onPick = (value: string) => {
    if (pressed) return;

    const href = getNextUrl(value);
    setActiveLabel(value);
    setPressed(true);

    setTimeout(() => router.push(href), 120);
  };

  return (
    <AppShell>
      <div className="w-full max-w-md relative mx-auto text-center px-4 pt-0 pb-10" style={{ marginTop: "-0.25rem" }}>
        <div className="flex flex-col items-center justify-center pointer-events-none mb-2">
          <h1 className="text-2xl font-extrabold tracking-tight leading-none text-white mb-0.5">
            Financing Status
          </h1>
        </div>
        <div className="flex flex-col gap-2 w-full mt-0 items-center">
          {OPTIONS.map((opt) => (
            <div key={opt.value} className="w-full max-w-xs">
              <ChoiceButton
                label={opt.label}
                active={activeLabel === opt.value}
                disabled={pressed}
                onClick={() => onPick(opt.value)}
              />
            </div>
          ))}
        </div>
        <p className="mt-5 text-[11px] text-white/45 text-center">
          Not affiliated with any government agency.
        </p>
      </div>
    </AppShell>
  );
}
