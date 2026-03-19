"use client";

import AppShell from "../../components/AppShell";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ChoiceButton from "../_components/ChoiceButton";

const TIMELINE_OPTIONS = [
  { label: "ASAP", value: "asap" },
  { label: "1-3 months", value: "1-3" },
  { label: "3-6 months", value: "3-6" },
  { label: "6+ months", value: "6plus" },
  { label: "Just exploring", value: "exploring" },
];

export default function BuyTimelinePage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [pressed, setPressed] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const onPick = (value: string) => {
    if (pressed) return;
    setActive(value);
    setPressed(true);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);

    // Persist generic timeline param for buy flows
    q.set("timeline", value);

    // Determine next step after timeline: compare-lenders or review
    const rawNext = (sp.get("next") || "").toLowerCase();
    const nextPath = rawNext === "compare-lenders" ? "/compare-lenders" : "/review";

    // Do not leak control param downstream
    q.delete("next");

    const href = `${nextPath}?${q.toString()}`;
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
          <p className="text-sm text-white/80 font-semibold mt-1">
            When are you looking to buy?
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full mt-0 items-center">
          {TIMELINE_OPTIONS.map((opt) => (
            <div key={opt.value} className="w-full max-w-xs">
              <ChoiceButton
                label={opt.label}
                active={active === opt.value}
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
