"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AppShell from "../../components/AppShell";
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
    <AppShell>
      <div className="w-full max-w-md relative mx-auto text-left px-4 pt-8 pb-10">
        <div className="flex flex-col items-center justify-center pointer-events-none mb-5 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight leading-none">
            Family Profile
          </h1>
          <p className="mt-3 text-sm font-semibold text-white/70">
            Who are you connected to?
          </p>
          {meta && (
            <p className="mt-1 text-xs text-white/50">{meta}</p>
          )}
        </div>
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
      </div>
    </AppShell>
  );
}
