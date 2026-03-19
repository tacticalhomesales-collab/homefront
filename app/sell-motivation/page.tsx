"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AppShell from "../../components/AppShell";
import ChoiceButton from "../_components/ChoiceButton";

type Motivation = { label: string; value: string };

const MOTIVATIONS: Motivation[] = [
  { label: "Relocating", value: "relocate" },
  { label: "Downsizing / Upsizing", value: "sizing" },
  { label: "Financial Reasons", value: "financial" },
  { label: "Inherited Property", value: "inherited" },
  { label: "Divorce / Separation", value: "divorce" },
  { label: "Problem Tenant", value: "tenant" },
  { label: "Other", value: "other" },
];

export default function SellMotivationPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pressed, setPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const onPick = (m: Motivation) => {
    if (pressed) return;

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("sell_motivation", m.value);

    const href = `/sell-status?${q.toString()}`;

    setActiveLabel(m.value);
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
            Selling Reason
          </h1>
          <p className="mt-1 text-sm font-semibold text-white/70">
            What's your primary motivation?
          </p>
        </div>

        <div className="mt-1 relative z-50 flex flex-col gap-2 w-full items-center">
          {MOTIVATIONS.map((m) => (
            <div key={m.value} className="w-full max-w-xs">
              <ChoiceButton
                label={m.label}
                active={activeLabel === m.value}
                disabled={pressed}
                onClick={() => onPick(m)}
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
