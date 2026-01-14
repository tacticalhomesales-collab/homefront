"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import PhoneShell from "./_components/PhoneShell";
import ChoiceButton from "./_components/ChoiceButton";
import LoadingApprovedOverlay from "./_components/LoadingApprovedOverlay";
import { useStepNav } from "./_components/useStepNav";

type Choice = { label: string; sub: string; lane: "mil" | "civ" };

export default function HomePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [active, setActive] = useState<string | null>(null);
  const { stage, locked, start } = useStepNav();

  const buildNext = (path: string, extra: Record<string, string>) => {
    const q = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(extra)) q.set(k, v);
    return { nextPath: path, nextUrl: `${path}?${q.toString()}` };
  };

  const CHOICES: Choice[] = [
    {
      label: "Military, Veteran, or First Responder",
      sub: "Service-aware guidance and benefits education.",
      lane: "mil",
    },
    {
      label: "Homebuyer, Seller, or Investor",
      sub: "Same education-first process, tailored language.",
      lane: "civ",
    },
  ];

  const onPick = (c: Choice) => {
    if (locked) return;
    setActive(c.label);

    const { nextPath, nextUrl } = buildNext("/mission", { lane: c.lane });
    start(router, nextUrl, nextPath);
  };

  return (
    <PhoneShell
      title="HomeFront"
      subtitle="Serving those who serve — at home."
    >
      <LoadingApprovedOverlay stage={stage} />

      <div className="relative z-50 flex flex-col gap-3 text-left">
        {CHOICES.map((c) => (
          <ChoiceButton
            key={c.label}
            label={c.label}
            sub={c.sub}
            active={active === c.label}
            disabled={locked}
            onClick={() => onPick(c)}
          />
        ))}
      </div>
    </PhoneShell>
  );
}
