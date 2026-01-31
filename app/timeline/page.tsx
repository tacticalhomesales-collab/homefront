"use client";
import AppShell from "../../components/AppShell";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const TIMELINE_OPTIONS = [
  { label: "ASAP", value: "asap" },
  { label: "1-3 months", value: "1-3" },
  { label: "3-6 months", value: "3-6" },
  { label: "6+ months", value: "6plus" },
  { label: "Just exploring", value: "exploring" },
];

export default function TimelinePage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [pressed, setPressed] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const onPick = (value: string) => {
    if (pressed) return;
    setActive(value);
    setPressed(true);
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("timeline", value);
    setTimeout(() => router.push(`/rental-numbers?${q.toString()}`), 120);
  };

  return (
    <AppShell>
      <div className="w-full max-w-md mx-auto flex flex-col items-center pt-1" style={{marginTop: '-0.75rem'}}>
        <h1 className="text-xl font-extrabold text-center mb-1">Timeline</h1>
        <div className="text-sm text-white/80 text-center mb-2 font-semibold">When are you looking to rent?</div>
        <div className="w-full flex flex-col gap-2 mt-1">
          {TIMELINE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onPick(opt.value)}
              disabled={pressed}
              className={[
                "cursor-pointer pointer-events-auto block w-full py-2 rounded-lg text-sm font-extrabold active:scale-[0.99] transition select-none touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30",
                active === opt.value
                  ? "bg-[#ff385c] text-white shadow-[0_4px_10px_rgba(255,56,92,0.18)]"
                  : pressed
                  ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                  : "border border-white/15 bg-white/10 text-white hover:bg-white/15"
              ].join(" ")}
              style={{ fontSize: "clamp(12px,2.5vw,15px)" }}
              aria-pressed={active === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="mt-5 text-[11px] text-white/45 text-center">
          Not affiliated with any government agency.
        </p>
      </div>
    </AppShell>
  );
}
