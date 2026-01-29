"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const CATEGORIES = [
  { label: "Enlisted", value: "enlisted" },
  { label: "Officer", value: "officer" },
  { label: "Warrant Officer", value: "warrant" },
  { label: "Other", value: "other" },
];

export default function ServiceCategoryPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [pressed, setPressed] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const goNext = (category: string) => {
    if (pressed) return;
    setActive(category);
    setPressed(true);
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("service_category", category);
    let next = "/paygrade-enlisted";
    if (category === "officer") next = "/paygrade-officer";
    else if (category === "warrant") next = "/paygrade-warrant";
    else if (category === "other") next = "/years-of-service";
    router.push(`${next}?${q.toString()}`);
  };

  return (
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        {/* Logo at the top */}
        <div className="mx-auto w-full max-w-[95vw] mt-6 mb-2 pointer-events-none select-none">
          <img
            src="/homefront-badge.png"
            alt="HomeFront"
            className="w-full h-auto scale-200 origin-center"
            draggable={false}
          />
        </div>
        <h1 className="text-2xl font-extrabold text-center mb-2">Service Category</h1>
        <div className="text-base text-white/80 text-center mb-4 font-semibold">Select your service category.</div>
        {/* 2x2 grid for options */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full mt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => goNext(cat.value)}
              disabled={pressed}
              className={[
                "cursor-pointer pointer-events-auto block w-full py-6 rounded-2xl text-base font-extrabold active:scale-[0.99] transition select-none touch-manipulation focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                active === cat.value
                  ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]"
                  : pressed
                  ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                  : "border border-white/15 bg-white/10 text-white hover:bg-white/15"
              ].join(" ")}
              style={{ fontSize: "clamp(14px,3vw,17px)" }}
              aria-pressed={active === cat.value}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
