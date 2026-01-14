"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import PhoneShell from "../_components/PhoneShell";
import ChoiceButton from "../_components/ChoiceButton";
import LoadingApprovedOverlay from "../_components/LoadingApprovedOverlay";
import { useStepNav } from "../_components/useStepNav";

const ROLES = ["Law Enforcement", "Fire", "EMS / Paramedic", "Dispatcher", "Other"] as const;

export default function FirstResponderPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [active, setActive] = useState<string | null>(null);
  const { stage, locked, start } = useStepNav();

  const buildNext = (path: string, extra: Record<string, string>) => {
    const q = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(extra)) q.set(k, v);
    return { nextPath: path, nextUrl: `${path}?${q.toString()}` };
  };

  const onPick = (role: string) => {
    if (locked) return;
    setActive(role);

    const { nextPath, nextUrl } = buildNext("/years-of-service", {
      audience: "first_responder",
      role,
    });
    start(router, nextUrl, nextPath);
  };

  const mission = sp.get("mission") || "";
  const location = sp.get("location") || "";
  const meta =
    (mission ? `Mission: ${mission}` : "") +
    (mission && location ? " • " : "") +
    (location ? `Location: ${location}` : "");

  return (
    <PhoneShell title="First Responder" subtitle="Select the option that best fits you." meta={meta || undefined}>
      <LoadingApprovedOverlay stage={stage} />

      <div className="relative z-50 flex flex-col gap-3 text-left">
        {ROLES.map((r) => (
          <ChoiceButton
            key={r}
            label={r}
            active={active === r}
            disabled={locked}
            onClick={() => onPick(r)}
          />
        ))}
      </div>
    </PhoneShell>
  );
}
