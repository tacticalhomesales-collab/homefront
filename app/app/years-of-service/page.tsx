"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import PhoneShell from "../_components/PhoneShell";
import ChoiceButton from "../_components/ChoiceButton";
import LoadingApprovedOverlay from "../_components/LoadingApprovedOverlay";
import { useStepNav } from "../_components/useStepNav";

const YEARS_OPTIONS = [
  "0–1",
  "2–3",
  "4–6",
  "7–10",
  "11–15",
  "16–20",
  "21–25",
  "26–30",
  "31+",
] as const;

export default function YearsOfServicePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [active, setActive] = useState<string | null>(null);
  const { stage, locked, start } = useStepNav();

  const onPick = (years: string) => {
    if (locked) return;
    setActive(years);

    const q = new URLSearchParams(sp.toString());
    q.set("years_of_service", years);

    const nextPath = "/contact";
    const nextUrl = `${nextPath}?${q.toString()}`;

    start(router, nextUrl, nextPath);
  };

  const mission = sp.get("mission") || "";
  const location = sp.get("location") || "";
  const meta =
    (mission ? `Mission: ${mission}` : "") +
    (mission && location ? " • " : "") +
    (location ? `Location: ${location}` : "");

  return (
    <PhoneShell title="Years of Service" subtitle="Select the closest range." meta={meta || undefined}>
      <LoadingApprovedOverlay stage={stage} />

      <div className="relative z-50 flex flex-col gap-3 text-left">
        {YEARS_OPTIONS.map((y) => (
          <ChoiceButton
            key={y}
            label={y}
            active={active === y}
            disabled={locked}
            onClick={() => onPick(y)}
          />
        ))}

        <p className="mt-1 text-[11px] text-white/55 pointer-events-none">
          Next: Contact
        </p>
      </div>
    </PhoneShell>
  );
}
