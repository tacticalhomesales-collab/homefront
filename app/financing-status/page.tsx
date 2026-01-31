
"use client";

import AppShell from "../../components/AppShell";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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

    // For other options, route to match-preview (now review, identity already collected)
    return `/review?${q.toString()}`;
  };

  const onPick = (value: string) => {
    if (pressed) return;

    const href = getNextUrl(value);
    setActiveLabel(value);
    setPressed(true);

    setTimeout(() => router.push(href), 120);
  };

  const OptionButton = ({ label, value }: { label: string; value: string }) => {
    const isActive = activeLabel === value;

    return (
      <button
        type="button"
        disabled={pressed}
        onClick={() => onPick(value)}
        className={[
          "cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-2 rounded-xl",
          "text-[15px] font-extrabold active:scale-[0.99] transition",
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
    <AppShell>
      <div className="w-full max-w-md relative mx-auto text-center px-4 pt-0 pb-10">
        <div className="flex flex-col items-center justify-center pointer-events-none mb-2">
          <h1 className="text-2xl font-extrabold tracking-tight leading-none text-white mb-0.5">
            Financing Status
          </h1>
        </div>
        <div className="flex flex-col gap-2 w-full mt-0">
          {OPTIONS.map((opt) => (
            <OptionButton key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </div>
        <p className="mt-5 text-[11px] text-white/45">
          Not affiliated with any government agency.
        </p>
      </div>
    </AppShell>
  );
}
