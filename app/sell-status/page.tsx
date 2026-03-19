"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AppShell from "../../components/AppShell";
import ChoiceButton from "../_components/ChoiceButton";

type Status = { label: string; value: string };

const STATUSES: Status[] = [
  { label: "Already Listed", value: "listed" },
  { label: "Interviewing Agents", value: "interviewing" },
  { label: "Considering Cash Offer", value: "cash_offer" },
  { label: "Not Sure Yet", value: "unsure" },
];

export default function SellStatusPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pressed, setPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const onPick = (s: Status) => {
    if (pressed) return;

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("sell_status", s.value);

    const href = `/review?${q.toString()}`;

    setActiveLabel(s.value);
    setPressed(true);

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
            Current Status
          </h1>
          <p className="mt-1 text-sm font-semibold text-white/70">
            Where are you in the selling process?
          </p>
        </div>

        <div className="mt-1 relative z-50 flex flex-col gap-2 w-full items-center">
          {STATUSES.map((s) => (
            <div key={s.value} className="w-full max-w-xs">
              <ChoiceButton
                label={s.label}
                active={activeLabel === s.value}
                disabled={pressed}
                onClick={() => onPick(s)}
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
