"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const AFFILIATIONS = [
  "Active Duty",
  "Reserve",
  "Retired",
  "Spouse / Family Member",
  "Other Military Affiliated"
] as const;

export default function FirstResponderAffiliationPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pressed, setPressed] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const goNext = (affiliation: string) => {
    if (pressed) return;
    setPressed(true);
    setActive(affiliation);
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("affiliation", affiliation);
    const url = `/mission?${q.toString()}`;
    setTimeout(() => {
      try {
        router.push(url);
      } finally {
        setTimeout(() => {
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/mission")) {
            window.location.assign(url);
          }
        }, 250);
      }
    }, 120);
  };

  return (
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl flex flex-col items-center">
        <h1 className="text-2xl font-extrabold mb-2 text-center">Military Affiliation</h1>
        <div className="text-white/70 text-center mb-6">Which best describes your military connection?</div>
        <div className="flex flex-col gap-3 w-full">
          {AFFILIATIONS.map((aff) => (
            <button
              key={aff}
              onClick={() => goNext(aff)}
              className={`w-full py-3 rounded-lg border font-bold text-lg transition focus:outline-none ${
                active === aff
                  ? "bg-blue-600 text-white border-blue-400 shadow-lg scale-[1.03]"
                  : "bg-white/10 text-white/90 border-white/20 hover:bg-blue-700/80 hover:text-white"
              }`}
              disabled={pressed}
            >
              {aff}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
