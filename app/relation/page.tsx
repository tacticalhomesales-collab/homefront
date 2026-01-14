"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PhoneShell from "../_components/PhoneShell";
import ChoiceButton from "../_components/ChoiceButton";
import { useStepNav } from "../_components/useStepNav";

const RELATIONS = [
  "Spouse / Partner",
  "Parent",
  "Son / Daughter",
  "Brother",
  "Sister",
  "Other",
] as const;

export default function RelationPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [active, setActive] = useState<string | null>(null);
  const { locked, start } = useStepNav();

  const connectedTo = sp.get("connected_to") || sp.get("audience") || "service_member";

  const title = useMemo(() => {
    if (connectedTo === "veteran") return "Relation to Veteran";
    if (connectedTo === "first_responder") return "Relation to First Responder";
    return "Relation to Service Member";
  }, [connectedTo]);

  const subtitle = useMemo(() => {
    if (connectedTo === "veteran") return "How are you related to the veteran?";
    if (connectedTo === "first_responder")
      return "How are you related to the first responder?";
    return "How are you related to the service member?";
  }, [connectedTo]);

  const buildNext = (path: string, extra: Record<string, string>) => {
    const q = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(extra)) q.set(k, v);
    return { nextPath: path, nextUrl: `${path}?${q.toString()}` };
  };

  const onPick = (relation: string) => {
    if (locked) return;
    setActive(relation);

    const nextPath = connectedTo === "first_responder" ? "/first-responder" : "/branch";
    const { nextUrl } = buildNext(nextPath, { relation });
    start(router, nextUrl, nextPath);
  };

  const mission = sp.get("mission") || "";
  const location = sp.get("location") || "";
  const meta =
    (mission ? `Mission: ${mission}` : "") +
    (mission && location ? " • " : "") +
    (location ? `Location: ${location}` : "");

  return (
    <PhoneShell title={title} subtitle={subtitle} meta={meta || undefined}>
      <div className="relative z-50 flex flex-col gap-3 text-left">
        {RELATIONS.map((r) => (
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
