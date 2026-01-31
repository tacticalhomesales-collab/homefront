
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AppShell from "../../components/AppShell";

export default function ReferLocationPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [value, setValue] = useState("");
  const [pressed, setPressed] = useState(false);
  const [active, setActive] = useState(false);

  const canContinue = value.trim().length > 0;

  const goNext = () => {
    if (pressed) return;
    const cleaned = value.trim();
    if (!cleaned) return;
    setActive(true);
    setPressed(true);

    // Store location in sessionStorage for referral pipeline
    if (typeof window !== "undefined") {
      const friend = JSON.parse(sessionStorage.getItem("referral_friend") || "{}");
      sessionStorage.setItem(
        "referral_friend",
        JSON.stringify({ ...friend, location: cleaned })
      );
    }

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);

    setTimeout(() => router.push(`/refer-timeline?${q.toString()}`), 120);
  };

  return (
    <AppShell>
      <div className="w-full max-w-md relative mx-auto text-left px-4 pt-8 pb-10">
        <div className="flex flex-col items-center justify-center pointer-events-none mb-5 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight leading-none">
            Friend's Location
          </h1>
          <p className="mt-3 text-sm font-semibold text-white/70">
            Enter a City or ZIP for your friend's search area.
          </p>
        </div>
        <div className="relative z-50">
          <div className="w-[calc(100%+2.5rem)] -mx-5">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              inputMode="text"
              autoComplete="postal-code"
              placeholder="City or ZIP (e.g., 92028)"
              className={["w-full rounded-2xl px-4 py-4","bg-white/10 border border-white/15 text-white","placeholder:text-white/35","outline-none","focus:border-white/25 focus:ring-4 focus:ring-[#ff385c]/20",].join(" ")}
            />
          </div>
          <div className="mt-3 w-[calc(100%+2.5rem)] -mx-5">
            <button
              type="button"
              disabled={!canContinue || pressed}
              onClick={goNext}
              className={["cursor-pointer pointer-events-auto block w-full py-4 rounded-2xl","text-[21px] font-extrabold active:scale-[0.99] transition","select-none touch-manipulation","focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",!canContinue || pressed? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed": active? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]":"border border-white/15 bg-white/10 text-white hover:bg-white/15",].join(" ")}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

