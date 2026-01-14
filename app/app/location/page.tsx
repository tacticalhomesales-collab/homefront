"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PhoneShell from "../_components/PhoneShell";
import LoadingApprovedOverlay from "../_components/LoadingApprovedOverlay";
import { useStepNav } from "../_components/useStepNav";

export default function LocationPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const lane = sp.get("lane") || "";
  const mission = sp.get("mission") || "";

  const [location, setLocation] = useState(sp.get("location") || "");
  const [error, setError] = useState("");
  const [pressed, setPressed] = useState(false);

  const { stage, locked, start } = useStepNav();

  const nextPath = useMemo(() => {
    return lane === "mil" ? "/audience" : "/contact";
  }, [lane]);

  const buildNextUrl = (loc: string) => {
    const q = new URLSearchParams(sp.toString());
    q.set("location", loc);
    return `${nextPath}?${q.toString()}`;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const loc = location.trim();
    if (!loc) {
      setError("Please enter a city or ZIP.");
      return;
    }

    if (locked) return;
    setPressed(true);

    const nextUrl = buildNextUrl(loc);
    start(router, nextUrl, nextPath);
  };

  const meta =
    (mission ? `Mission: ${mission}` : "") +
    (mission && lane ? " • " : "") +
    (lane ? `Lane: ${lane === "mil" ? "Service" : "Civilian"}` : "");

  return (
    <PhoneShell title="Location" subtitle="City or ZIP" meta={meta || undefined}>
      <LoadingApprovedOverlay stage={stage} />

      <form onSubmit={onSubmit} className="relative z-50 text-left">
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Oceanside, CA or 92054"
          inputMode="text"
          className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-base font-semibold text-white placeholder:text-white/40 focus:outline-none focus:ring-4 focus:ring-[#ff385c]/30"
        />

        {error ? (
          <p className="mt-3 text-[12px] font-semibold text-[#ff385c]">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={locked}
          className={[
            "mt-4 block w-full py-4 rounded-2xl text-[18px] font-extrabold transition active:scale-[0.99]",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
            pressed || locked
              ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]"
              : "border border-white/15 bg-white/10 text-white hover:bg-white/15",
            locked ? "cursor-not-allowed opacity-80" : "cursor-pointer",
          ].join(" ")}
        >
          Continue
        </button>
      </form>
    </PhoneShell>
  );
}
