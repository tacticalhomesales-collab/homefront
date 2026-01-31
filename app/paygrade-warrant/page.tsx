
"use client";
import AppShell from "../../components/AppShell";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const PAYGRADES = [
  "WO-1", "WO-2", "WO-3", "WO-4", "WO-5", "Other"
];

export default function PaygradeWarrantPage() {
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
      <div className="w-full max-w-md mx-auto flex flex-col items-center px-4 pt-4 pb-2">
        <h1 className="text-xl font-extrabold text-center mb-1">Warrant Officer Paygrade</h1>
        <div className="text-sm text-white/80 text-center mb-2 font-semibold">Select your paygrade.</div>
        {/* Condensed grid: 1 row of 5 for all warrant officer paygrades */}
        <div className="w-full mt-0 grid grid-cols-2 gap-2">
          {PAYGRADES.map((pg) => (
            <button
              key={pg}
              type="button"
              onClick={() => goNext(pg)}
              disabled={pressed}
              className={[
                "cursor-pointer pointer-events-auto block w-full py-3 rounded-xl text-base font-extrabold active:scale-[0.99] transition select-none touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30",
                active === pg
                  ? "bg-[#ff385c] text-white shadow-[0_8px_20px_rgba(255,56,92,0.18)]"
                  : pressed
                  ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                  : "border border-white/15 bg-white/10 text-white hover:bg-white/15"
              ].join(" ")}
              style={{ fontSize: "clamp(14px,3vw,17px)" }}
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
