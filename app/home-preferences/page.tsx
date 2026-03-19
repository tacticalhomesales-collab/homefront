"use client";

import AppShell from "../../components/AppShell";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const PROPERTY_TYPES = [
  { label: "House", value: "house" },
  { label: "Townhome", value: "townhome" },
  { label: "Condo", value: "condo" },
  { label: "Apartment", value: "apartment" },
] as const;

const BEDROOM_OPTIONS = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5+", value: "5plus" },
  { label: "No preference", value: "no_pref_bedrooms" },
] as const;

export default function HomePreferencesPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const initialPropertyType = useMemo(
    () => sp.get("home_property_type") || "",
    [sp]
  );
  const initialBedrooms = useMemo(
    () => sp.get("home_bedrooms") || "",
    [sp]
  );

  const [propertyType, setPropertyType] = useState(initialPropertyType);
  const [bedrooms, setBedrooms] = useState(initialBedrooms);
  const [pressed, setPressed] = useState(false);

  const canContinue = propertyType.trim().length > 0 && bedrooms.trim().length > 0;

  const handleContinue = () => {
    if (!canContinue || pressed) return;

    setPressed(true);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);

    q.set("home_property_type", propertyType);
    q.set("home_bedrooms", bedrooms);

    const summaryParts: string[] = [];
    if (propertyType) summaryParts.push(propertyType);
    if (bedrooms) summaryParts.push(`${bedrooms}_bedrooms`);
    if (summaryParts.length) {
      q.set("home_preferences", summaryParts.join(","));
    }

    // After collecting home preferences, continue the funnel
    // into the standard Location step.
    const href = `/location?${q.toString()}`;
    setTimeout(() => router.push(href), 120);
  };

  const OptionButton = ({
    label,
    value,
    group,
  }: {
    label: string;
    value: string;
    group: "property" | "bedrooms";
  }) => {
    const activeValue = group === "property" ? propertyType : bedrooms;
    const isActive = activeValue === value;

    const onClick = () => {
      if (pressed) return;
      if (group === "property") setPropertyType(value);
      else setBedrooms(value);
    };

    return (
      <button
        type="button"
        disabled={pressed}
        onClick={onClick}
        className={[
          "cursor-pointer pointer-events-auto block w-full py-1.5 rounded-xl",
          "text-sm font-extrabold active:scale-[0.99] transition",
          "select-none touch-manipulation",
          isActive
            ? "bg-[#ff385c] text-white shadow-[0_4px_12px_rgba(255,56,92,0.22)]"
            : pressed
            ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
            : "border border-white/15 bg-white/10 text-white hover:bg-white/15",
        ].join(" ")}
        style={{ fontSize: "clamp(12px,2.4vw,14px)" }}
      >
        {label}
      </button>
    );
  };

  return (
    <AppShell>
      <div
        className="w-full max-w-md mx-auto flex flex-col items-center pt-1 px-4"
        style={{ marginTop: "-0.75rem" }}
      >
        <div className="w-full flex flex-col items-center text-center pointer-events-none mb-2">
          <h1 className="text-2xl font-extrabold tracking-tight leading-none text-white mb-0.5">
            Home Preferences
          </h1>
        </div>

        <div className="w-full mt-1 space-y-3">
          <div>
            <div className="text-[11px] font-extrabold text-white/70 mb-1">
              Property type
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
              {PROPERTY_TYPES.map((t) => (
                <OptionButton
                  key={t.value}
                  label={t.label}
                  value={t.value}
                  group="property"
                />
              ))}
            </div>
          </div>

          <div className="mt-1">
            <div className="text-[11px] font-extrabold text-white/70 mb-1">
              Bedrooms
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
              {BEDROOM_OPTIONS.map((b) => (
                <OptionButton
                  key={b.value}
                  label={b.label}
                  value={b.value}
                  group="bedrooms"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-xs mt-4">
          <button
            type="button"
            disabled={!canContinue || pressed}
            onClick={handleContinue}
            className={[
              "cursor-pointer pointer-events-auto block w-full py-2 rounded-xl",
              "text-[15px] font-extrabold active:scale-[0.99] transition",
              "select-none touch-manipulation",
              !canContinue || pressed
                ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                : "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]",
            ].join(" ")}
          >
            Continue
          </button>
        </div>

        <p className="mt-5 text-[11px] text-white/45 text-center">
          Not affiliated with any government agency.
        </p>
      </div>
    </AppShell>
  );
}
