"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";


import AppShell from "../../components/AppShell";
// Example: Army, Navy, etc. Use branch from query param
const PAYGRADES_ROW1 = ["E-1", "E-2", "E-3", "E-4", "E-5", "E-6"];
const PAYGRADES_ROW2 = ["E-7", "E-8", "E-9", "Other"];

export default function PaygradeEnlistedPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [pressed, setPressed] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const branch = sp.get("branch") || "";

  const goNext = (paygrade: string) => {
    if (pressed) return;
    setActive(paygrade);
    setPressed(true);
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("paygrade", paygrade);
    router.push(`/years-of-service?${q.toString()}`);
  };

  return (
    <AppShell>
      <div className="w-full max-w-md mx-auto flex flex-col items-center pt-1" style={{marginTop: '-0.75rem'}}>
        <h1 className="text-xl font-extrabold text-center mb-1">Enlisted Paygrade</h1>
        <div className="text-sm text-white/80 text-center mb-2 font-semibold">Select your paygrade.</div>
        {/* Condensed grid: 2 rows, 6 and 5 boxes for all enlisted paygrades */}
        <div className="w-full mt-1 grid grid-cols-2 gap-2">
          {[...PAYGRADES_ROW1, ...PAYGRADES_ROW2].map((pg) => (
            <button
              key={pg}
              type="button"
              onClick={() => goNext(pg)}
              disabled={pressed}
              className={[
                "cursor-pointer pointer-events-auto block w-full py-2 rounded-lg text-sm font-extrabold active:scale-[0.99] transition select-none touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30",
                active === pg
                  ? "bg-[#ff385c] text-white shadow-[0_4px_10px_rgba(255,56,92,0.18)]"
                  : pressed
                  ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                  : "border border-white/15 bg-white/10 text-white hover:bg-white/15"
              ].join(" ")}
              style={{ fontSize: "clamp(12px,2.5vw,15px)" }}
              aria-pressed={active === pg}
            >
              {pg}
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
