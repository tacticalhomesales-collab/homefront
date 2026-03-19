"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AppShell from "../../components/AppShell";
import ChoiceButton from "../_components/ChoiceButton";

type Timeline = { label: string; value: string };

const TIMELINES: Timeline[] = [
  { label: "ASAP (< 1 month)", value: "asap" },
  { label: "1-3 months", value: "1-3mo" },
  { label: "3-6 months", value: "3-6mo" },
  { label: "6+ months", value: "6+mo" },
  { label: "Just exploring", value: "exploring" },
];

export default function SellTimelinePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pressed, setPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const onPick = (t: Timeline) => {
    if (pressed) return;

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("sell_timeline", t.value);

    const href = `/sell-motivation?${q.toString()}`;

    setActiveLabel(t.value);
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
            Timeline
          </h1>
          <p className="mt-1 text-sm font-semibold text-white/70">When do you plan to sell?</p>
        </div>

        <div className="mt-1 relative z-50 flex flex-col gap-2 w-full items-center">
          {TIMELINES.map((t) => (
            <div key={t.value} className="w-full max-w-xs">
              <ChoiceButton
                label={t.label}
                active={activeLabel === t.value}
                disabled={pressed}
                onClick={() => onPick(t)}
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
