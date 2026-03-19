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

export default function RentalTimelinePage() {
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
    // Generic timeline param for manage/landlord flows
    q.set("timeline", value);

    const href = `/rental-status?${q.toString()}`;
    setTimeout(() => router.push(href), 120);
  };

  return (
    <AppShell>
      <div
        className="w-full max-w-md relative mx-auto text-center px-4 pt-0 pb-10"
        style={{ marginTop: "0.25rem" }}
      >
        <div className="flex flex-col items-center justify-center pointer-events-none mb-2">
          <h1 className="text-2xl font-extrabold tracking-tight leading-none text-white mb-0.5">
            Timeline
          </h1>
          <p className="mt-1 text-sm font-semibold text-white/70">
            When do you need help with this property?
          </p>
        </div>

        <div className="mt-1 relative z-50 flex flex-col gap-2 w-full items-center">
          {TIMELINE_OPTIONS.map((t) => (
            <div key={t.value} className="w-full max-w-xs">
              <ChoiceButton
                label={t.label}
                active={active === t.value}
                disabled={pressed}
                onClick={() => onPick(t.value)}
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
