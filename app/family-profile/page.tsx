"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import PhoneShell from "../_components/PhoneShell";
import ChoiceButton from "../_components/ChoiceButton";
import { useStepNav } from "../_components/useStepNav";

type Choice = { label: string; connected_to: "service_member" | "veteran" | "first_responder" };

export default function FamilyProfilePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [active, setActive] = useState<string | null>(null);
  const { locked, start } = useStepNav();

  const buildNext = (path: string, extra: Record<string, string>) => {
    const q = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(extra)) q.set(k, v);
    return { nextPath: path, nextUrl: `${path}?${q.toString()}` };
  };

  const CHOICES: Choice[] = [
    { label: "Service Member", connected_to: "service_member" },
    { label: "Veteran", connected_to: "veteran" },
    { label: "First Responder", connected_to: "first_responder" },
  ];

  const onPick = (c: Choice) => {
    if (locked) return;
    setActive(c.label);

    const { nextPath, nextUrl } = buildNext("/relation", {
      audience: c.connected_to,
      connected_to: c.connected_to,
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
    <PhoneShell title="Family Profile" subtitle="Who are you connected to?" meta={meta || undefined}>
      <div className="relative z-50 flex flex-col gap-3 text-left">
        {CHOICES.map((c) => (
          <ChoiceButton
            key={c.label}
            label={c.label}
            active={active === c.label}
            disabled={locked}
            onClick={() => onPick(c)}
          />
        ))}
      </div>
    </PhoneShell>
  );
}
