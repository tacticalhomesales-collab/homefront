"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AppShell from "../../components/AppShell";

type Status = { label: string; value: string };

const STATUSES: Status[] = [
  { label: "Occupied by Tenant", value: "occupied" },
  { label: "Vacant", value: "vacant" },
  { label: "House Hack (I live there)", value: "househack" },
];

export default function RentalStatusPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pressed, setPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const onPick = (s: Status) => {
    if (pressed) return;

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("rental_status", s.value);

    const href = `/rental-numbers?${q.toString()}`;

    setActiveLabel(s.value);
    setPressed(true);

    setTimeout(() => router.push(href), 120);
  };

  const StatusButton = ({ label, value }: Status) => {
    const isActive = activeLabel === value;

    return (
      <div className="w-full max-w-xs mx-auto">
        <button
          type="button"
          disabled={pressed}
          onClick={() => onPick({ label, value })}
          className={[
            "cursor-pointer pointer-events-auto block w-full py-1.5 rounded-2xl",
            "text-[15px] font-extrabold active:scale-[0.99] transition",
            "select-none touch-manipulation",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
            isActive
              ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]"
              : pressed
              ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
              : "border border-white/15 bg-white/10 text-white hover:bg-white/15",
          ].join(" ")}
        >
          {label}
        </button>
      </div>
    );
  };

  return (
    <AppShell>
      <div
        className="w-full max-w-md relative mx-auto text-center px-4 pt-0 pb-10"
        style={{ marginTop: "0.25rem" }}
      >
        <div className="flex flex-col items-center justify-center pointer-events-none mb-2">
          <h1 className="text-2xl font-extrabold tracking-tight leading-none text-white mb-0.5">
            Rental Status
          </h1>
          <p className="mt-1 text-sm font-semibold text-white/70">
            What's the current status?
          </p>
        </div>

        <div className="mt-1 relative z-50 flex flex-col gap-3 items-center">
          {STATUSES.map((s) => (
            <StatusButton key={s.value} {...s} />
          ))}
        </div>

        <p className="mt-5 text-[11px] text-white/45 text-center">
          Not affiliated with any government agency.
        </p>
      </div>
    </AppShell>
  );
}
