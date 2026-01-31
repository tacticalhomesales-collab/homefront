"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AppShell from "../../components/AppShell";
import ChoiceButton from "../_components/ChoiceButton";

type Status = { label: string; value: string; audience: string };

const STATUSES: Status[] = [
  { label: "Active Duty", value: "active", audience: "service_member" },
  { label: "Reserve", value: "reserve", audience: "service_member" },
  { label: "National Guard", value: "guard", audience: "service_member" },
  { label: "Veteran / Retired", value: "veteran", audience: "veteran" },
  { label: "Spouse / Family", value: "family", audience: "family_member" },
];

function MilitaryStatusPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [pressed, setPressed] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const onPick = (s: Status) => {
    if (pressed) return;
    setActive(s.value);
    setPressed(true);
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("service_status", s.value);
    q.set("audience", s.audience);
    let nextPage = "branch";
    if (s.value === "family") nextPage = "family-profile";
    else if (s.value === "guard") nextPage = "rank";
    const href = `/${nextPage}?${q.toString()}`;
    setTimeout(() => router.push(href), 120);
  };

  return (
    <AppShell>
      <div className="relative z-50 flex flex-col gap-2 items-center justify-center w-full mt-0">
        <h1 className="text-xl font-extrabold tracking-tight leading-none text-white mb-1">Military Status</h1>
        <p className="mb-1 text-xs font-semibold text-white/70">Which best describes you?</p>
        {STATUSES.map((s) => (
          <div className="w-full max-w-xs" key={s.value}>
            <ChoiceButton
              label={s.label}
              active={active === s.value}
              disabled={pressed}
              onClick={() => onPick(s)}
            />
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-white/45 text-center w-full">
        Not affiliated with any government agency.
      </p>
    </AppShell>
  );
}

export default MilitaryStatusPage;
