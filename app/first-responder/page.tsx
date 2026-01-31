
"use client";

import AppShell from "../../components/AppShell";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ROLES = ["Law Enforcement", "Fire", "EMS / Paramedic", "Dispatcher", "Other"] as const;

export default function FirstResponderPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pressed, setPressed] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const goNext = (role: string) => {
    if (pressed) return;

    setPressed(true);
    setActive(role);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("role", role);
    q.set("audience", "first_responder");

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
    <AppShell>
      <div className="flex flex-col items-center text-center pt-0 pb-8 min-h-[70svh] px-4">
        <div className="w-full max-w-md relative">
          <div className="mb-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[18px] font-extrabold tracking-[-0.02em] text-white/80 opacity-0 pointer-events-none select-none">
            <span>Buy</span>
            <span className="text-white/25">•</span>
            <span>Sell</span>
            <span className="text-white/25">•</span>
            <span>Rent</span>
            <span className="text-white/25">•</span>
            <span>Manage</span>
          </div>
          <div className="m-0 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-4xl font-extrabold tracking-tight leading-none text-white">
              First Responder
            </h1>
            <p className="mt-1 text-sm font-semibold text-white/70">
              Select the option that best fits you.
            </p>
          </div>
          <div className="mt-1 relative z-50 flex flex-col gap-2">
            {ROLES.map((r) => {
              const isActive = active === r;

              return (
                <button
                  key={r}
                  type="button"
                  disabled={pressed}
                  onClick={() => goNext(r)}
                  className={[
                    "cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-2 rounded-lg",
                    "text-[15px] font-extrabold active:scale-[0.99] transition",
                    "select-none touch-manipulation",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30",
                    isActive
                      ? "bg-[#ff385c] text-white shadow-[0_6px_18px_rgba(255,56,92,0.18)] cursor-not-allowed"
                      : pressed
                      ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                      : "border border-white/15 bg-white/10 text-white hover:bg-white/15",
                  ].join(" ")}
                >
                  {r}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-[11px] text-white/45">
            Not affiliated with any government agency.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
