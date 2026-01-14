"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import PhoneShell from "../_components/PhoneShell";
import LoadingApprovedOverlay from "../_components/LoadingApprovedOverlay";
import { useStepNav } from "../_components/useStepNav";

const PAYGRADES = [
  "E-1","E-2","E-3","E-4","E-5","E-6","E-7","E-8","E-9","E-9 (SGM/MCPO)",
  "W-1","W-2","W-3","W-4","W-5","Warrant (Other)",
  "O-1","O-2","O-3","O-4","O-5","O-6","O-7+","Officer (Other)",
] as const;

export default function RankPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [active, setActive] = useState<string | null>(null);
  const { stage, locked, start } = useStepNav();

  const onPick = (paygrade: string) => {
    if (locked) return;
    setActive(paygrade);

    const q = new URLSearchParams(sp.toString());
    q.set("paygrade", paygrade);

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

  const GridButton = ({ label }: { label: string }) => {
    const isActive = active === label;

    return (
      <button
        type="button"
        disabled={locked}
        onClick={() => onPick(label)}
        className={[
          "w-full rounded-2xl px-4 py-4 text-left transition active:scale-[0.99]",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
          isActive
            ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]"
            : "border border-white/15 bg-white/10 text-white hover:bg-white/15",
          locked ? "cursor-not-allowed opacity-80" : "cursor-pointer",
        ].join(" ")}
      >
        <span className="text-[15px] font-extrabold tracking-[-0.02em] leading-tight">{label}</span>
      </button>
    );
  };

  return (
    <PhoneShell title="Paygrade" subtitle="Select your paygrade." meta={meta || undefined}>
      <LoadingApprovedOverlay stage={stage} />

      <div className="relative z-50">
        <div className="grid grid-cols-2 gap-2 text-left">
          {PAYGRADES.map((p) => (
            <GridButton key={p} label={p} />
          ))}
        </div>

        <p className="mt-4 text-[11px] text-white/55 pointer-events-none">
          Next: Contact
        </p>
      </div>
    </PhoneShell>
  );
}
