"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import FlowLayout from "../_components/FlowLayout";

type Mission = { label: string; value: string };

const MISSIONS: Mission[] = [
  { label: "Buy", value: "buy" },
  { label: "Sell", value: "sell" },
  { label: "Rent", value: "rent" },
  { label: "Manage my Rental", value: "manage_rental" },
];

export default function MissionPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pressed, setPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const buildHref = (missionValue: string) => {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("mission", missionValue);

    // Branch based on mission type
    if (missionValue === "sell") {
      return `/sell-property?${q.toString()}`;
    } else if (missionValue === "manage_rental") {
      return `/rental-property?${q.toString()}`;
    } else {
      // buy or rent -> location
      return `/location?${q.toString()}`;
    }
  };

  const onPick = (m: Mission) => {
    if (pressed) return;

    const href = buildHref(m.value);
    setActiveLabel(m.value);
    setPressed(true);
    setTimeout(() => router.push(href), 120);
  };

  const MissionButton = ({ label, value }: Mission) => {
    const isActive = activeLabel === value;

    return (
      <button
        type="button"
        disabled={pressed}
        onClick={() => onPick({ label, value })}
        className={[
          "cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl",
          "text-[21px] font-extrabold active:scale-[0.99] transition",
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
    );
  };

  return (
    <FlowLayout
      title="Mission"
      subtitle="Choose one to continue."
      logoSrc="/homefront-logo.png"
      logoAlt="HomeFront Logo"
      logoContainerClassName="mx-auto w-full max-w-[98vw] sm:max-w-[900px] mt-2 mb-2 pointer-events-none select-none"
      logoClassName="w-full h-auto"
      logoWidth={900}
      logoHeight={650}
      topContent={
        <div className="mb-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] font-bold tracking-[-0.01em] text-gray-400 select-none">
          <span>Buy</span>
          <span className="mx-0.5">•</span>
          <span>Sell</span>
          <span className="mx-0.5">•</span>
          <span>Rent</span>
          <span className="mx-0.5">•</span>
          <span>Manage</span>
        </div>
      }
    >
      <div className="relative z-50 flex flex-col gap-3">
        {MISSIONS.map((m) => (
          <MissionButton key={m.value} {...m} />
        ))}
      </div>
    </FlowLayout>
  );
}
