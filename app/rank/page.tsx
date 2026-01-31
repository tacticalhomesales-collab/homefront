
"use client";

import AppShell from "../../components/AppShell";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RankPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [pressed, setPressed] = useState(false);
  function startVerifyThenGoContact(paygrade: string) {
    if (pressed) return;
    setPressed(true);
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("paygrade", paygrade);
    const url = `/verify?${q.toString()}`;
    setTimeout(() => {
      try {
        router.push(url);
      } finally {
        setTimeout(() => {
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/verify")) {
            window.location.assign(url);
          }
        }, 250);
      }
    }, 120);
  }
  return (
    <AppShell>
      <div className="w-full max-w-md relative mx-auto text-center px-4 pt-8 pb-10">
        <div className="flex flex-col items-center justify-center pointer-events-none mb-5">
          <h1 className="text-4xl font-extrabold tracking-tight leading-none text-white">
            Pay Grade
          </h1>
          <p className="mt-3 text-sm font-semibold text-white/70">
            Select your current pay grade.
          </p>
        </div>
        <div className="mt-2 relative z-50">
          <div className="grid grid-cols-2 gap-3 text-left">
            {[
              "E-1","E-2","E-3","E-4","E-5","E-6","E-7","E-8","E-9","E-9 (SGM/MCPO)",
              "W-1","W-2","W-3","W-4","W-5","Warrant (Other)",
              "O-1","O-2","O-3","O-4","O-5","O-6","O-7+","Officer (Other)"
            ].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="w-full py-3 rounded-2xl text-[15px] sm:text-lg font-extrabold transition active:scale-[0.99] select-none touch-manipulation bg-white/10 border border-white/15 text-white hover:bg-white/15 cursor-pointer"
                  onClick={() => startVerifyThenGoContact(label)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="col-span-2">
              <button
                type="button"
                disabled={pressed}
                onClick={() => startVerifyThenGoContact("Unknown")}
                className={["w-full py-3 rounded-2xl text-[15px] sm:text-lg font-extrabold transition active:scale-[0.99]","select-none touch-manipulation",pressed? "bg-[#ff385c] text-black cursor-not-allowed":"bg-white/10 border border-white/15 text-white hover:bg-white/15 cursor-pointer",].join(" ")}
              >
                Not sure
              </button>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-white/45">
            Not affiliated with any government agency.
          </p>
        </div>
      </AppShell>
    );
}
