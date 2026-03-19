
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AppShell from "../../components/AppShell";
import ChoiceButton from "../_components/ChoiceButton";

const BRANCHES = [
  "Army",
  "Marine Corps",
  "Navy",
  "Air Force",
  "Space Force",
  "Coast Guard",
] as const;

export default function BranchPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pressed, setPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const goNext = (branch: string) => {
    if (pressed) return;

    setActiveLabel(branch);
    setPressed(true);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("branch", branch);

    const nextPath = "/service-category";
    const nextUrl = `${nextPath}?${q.toString()}`;

    setTimeout(() => {
      try {
        router.push(nextUrl);
      } finally {
        setTimeout(() => {
          if (
            typeof window !== "undefined" &&
            window.location.pathname !== nextPath
          ) {
            window.location.assign(nextUrl);
          }
        }, 250);
      }
    }, 120);
  };

  const BranchButton = ({ label }: { label: string }) => {
    const isActive = activeLabel === label;

    return (
      <div className="w-full max-w-xs mx-auto">
        <ChoiceButton
          label={label}
          active={isActive}
          disabled={pressed}
          onClick={() => goNext(label)}
        />
      </div>
    );
  };

  return (
    <AppShell>
      <div className="flex flex-col items-center text-center pt-0 pb-10 min-h-[70svh] px-4" style={{ marginTop: "-0.25rem" }}>
        <div className="w-full max-w-md relative">
          <div className="mb-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[14px] font-extrabold tracking-[-0.02em] text-white/80 opacity-0 pointer-events-none select-none">
            <span>Buy</span>
            <span className="text-white/25">•</span>
            <span>Sell</span>
            <span className="text-white/25">•</span>
            <span>Rent</span>
            <span className="text-white/25">•</span>
            <span>Manage</span>
          </div>

          <div className="-mt-3 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-2xl font-extrabold tracking-tight leading-none text-white mb-0.5">
              Branch of Service
            </h1>
          </div>

          <div className="mt-1 relative z-50 flex flex-col gap-2 items-center">
            {BRANCHES.map((b) => (
              <BranchButton key={b} label={b} />
            ))}
          </div>

          <p className="mt-5 text-[11px] text-white/45 text-center">
            Not affiliated with any government agency.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
