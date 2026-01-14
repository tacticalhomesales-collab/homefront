"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import PhoneShell from "../_components/PhoneShell";
import ChoiceButton from "../_components/ChoiceButton";
import { useStepNav } from "../_components/useStepNav";

type Choice = { label: string; nextPath: string; extra: Record<string, string> };

function AudienceContent() {
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
    { label: "Service Member", nextPath: "/branch", extra: { audience: "service_member" } },
    { label: "Veteran", nextPath: "/branch", extra: { audience: "veteran" } },
    { label: "First Responder", nextPath: "/first-responder", extra: { audience: "first_responder" } },
    {
      label: "Spouse / Family Member",
      nextPath: "/family-profile",
      extra: { requester: "family_member", relationship: "spouse_family" },
    },
  ];

  const onPick = (c: Choice) => {
    if (locked) return;
    setActive(c.label);
    const { nextPath, nextUrl } = buildNext(c.nextPath, c.extra);
    start(router, nextUrl, nextPath);
  };

  const mission = sp.get("mission") || "";
  const location = sp.get("location") || "";
  const meta =
    (mission ? `Mission: ${mission}` : "") +
    (mission && location ? " • " : "") +
    (location ? `Location: ${location}` : "");

  return (
    <PhoneShell title="Service Profile" subtitle="Select what best fits you." meta={meta || undefined}>
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

export default function AudiencePage() {
  return (
    <Suspense
      fallback={
        <PhoneShell title="Service Profile" subtitle="Select what best fits you.">
          <div className="h-8" />
        </PhoneShell>
      }
    >
      <AudienceContent />
    </Suspense>
  );
}
