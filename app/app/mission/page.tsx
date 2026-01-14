"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import PhoneShell from "../_components/PhoneShell";
import ChoiceButton from "../_components/ChoiceButton";
import LoadingApprovedOverlay from "../_components/LoadingApprovedOverlay";
import { useStepNav } from "../_components/useStepNav";

type Choice = { label: string; mission: string };

export default function MissionPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [active, setActive] = useState<string | null>(null);
  const { stage, locked, start } = useStepNav();

  const lane = sp.get("lane") || "";

  const buildNext = (path: string, extra: Record<string, string>) => {
    const q = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(extra)) q.set(k, v);
    return { nextPath: path, nextUrl: `${path}?${q.toString()}` };
  };

  const CHOICES: Choice[] = [
    { label: "Buy", mission: "buy" },
    { label: "Sell", mission: "sell" },
    { label: "Rent", mission: "rent" },
    { label: "Manage Rental", mission: "manage" },
  ];

  const onPick = (c: Choice) => {
    if (locked) return;
    setActive(c.label);

    const { nextPath, nextUrl } = buildNext("/location", { mission: c.mission });
    start(router, nextUrl, nextPath);
  };

  const meta =
    lane === "mil"
      ? "Lane: Service"
      : lane === "civ"
      ? "Lane: Civilian"
      : undefined;

  return (
    <PhoneShell title="Mission" subtitle="What are you trying to do?" meta={meta}>
      <LoadingApprovedOverlay stage={stage} />

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
