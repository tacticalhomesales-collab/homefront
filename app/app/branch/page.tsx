"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import PhoneShell from "../_components/PhoneShell";
import ChoiceButton from "../_components/ChoiceButton";
import LoadingApprovedOverlay from "../_components/LoadingApprovedOverlay";
import { useStepNav } from "../_components/useStepNav";

const BRANCHES = ["Army", "Marine Corps", "Navy", "Air Force", "Space Force", "Coast Guard"] as const;

export default function BranchPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [active, setActive] = useState<string | null>(null);
  const { stage, locked, start } = useStepNav();

  const onPick = (branch: string) => {
    if (locked) return;
    setActive(branch);

    const q = new URLSearchParams(sp.toString());
    q.set("branch", branch);

    const audience = q.get("audience") || "";
    const nextPath = audience === "veteran" ? "/retiring-rank" : "/rank";
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
    <PhoneShell title="Branch of Service" subtitle="Select your branch." meta={meta || undefined}>
      <LoadingApprovedOverlay stage={stage} />

      <div className="relative z-50 flex flex-col gap-3 text-left">
        {BRANCHES.map((b) => (
          <ChoiceButton
            key={b}
            label={b}
            active={active === b}
            disabled={locked}
            onClick={() => onPick(b)}
          />
        ))}
      </div>
    </PhoneShell>
  );
}
