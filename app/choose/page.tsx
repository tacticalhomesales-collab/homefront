

"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "../../components/AppShell";
import { IntentBadge, IntentBanner, IntentIcon } from "../../components/IntentVisuals";

export default function ChoosePage() {
  const router = useRouter();
  const sp = useSearchParams();
  const mission = sp.get("mission");

  const BUTTONS = [
    {
      label: "Military Affiliated",
      onClick: () => handleBranch("military"),
    },
    {
      label: "First Responder",
      onClick: () => handleBranch("first_responder"),
    },
    {
      label: "Civilian",
      onClick: () => handleBranch("civilian"),
    },
  ];

  function handleBranch(pathType: string) {
    setSelectedPath(pathType);
    setPressedButton(pathType);
    setTimeout(() => {
      setPressedButton(null);
      // Branch to the correct next step based on mission and pathType
      if (pathType === "military") {
        router.push(`/military-status?lane=service&service_track=military&mission=${mission || "buy"}`);
      } else if (pathType === "first_responder") {
        router.push(`/first-responder?lane=service&service_track=fr&mission=${mission || "buy"}`);
      } else {
        // Civilian: branch based on mission param
        if (mission === "sell") {
          router.push(`/sell-property?mission=sell`);
        } else if (mission === "manage" || mission === "manage_rental") {
          router.push(`/rental-property?mission=manage`);
        } else if (mission === "rent") {
          // Renter path: follow buyer flow
          router.push(`/military-status?lane=service&service_track=military&mission=rent`);
        } else {
          // Default to buy flow
          router.push(`/location?mission=${mission || "buy"}`);
        }
      }
    }, 120);
  }

  const [selectedPath, setSelectedPath] = React.useState<string | null>(null);
  const [pressedButton, setPressedButton] = React.useState<string | null>(null);

  const handleSelect = (label: string, onClick: () => void) => {
    setSelectedPath(label);
    setPressedButton(label);
    setTimeout(() => {
      setPressedButton(null);
      onClick();
    }, 120);
  };

  return (
    <AppShell>
      <div className="w-full max-w-md mx-auto flex flex-col items-center pt-1" style={{marginTop: '-0.75rem'}}>
        <h1 className="text-xl font-extrabold text-center mb-1 text-white">Choose Your Path</h1>
        <div className="text-sm text-white/80 text-center mb-2 font-semibold">Select what best describes you.</div>
        <div className="w-full flex flex-col gap-2 mt-1">
          {BUTTONS.map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={b.onClick}
              disabled={pressedButton === b.label}
              className={[
                "cursor-pointer pointer-events-auto block w-full py-2 rounded-lg text-sm font-extrabold active:scale-[0.99] transition select-none touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30",
                pressedButton === b.label
                  ? "bg-[#ff385c] text-white shadow-[0_4px_10px_rgba(255,56,92,0.18)]"
                  : "border border-white/15 bg-white/10 text-white hover:bg-white/15"
              ].join(" ")}
              style={{ fontSize: "clamp(12px,2.5vw,15px)" }}
              aria-pressed={pressedButton === b.label}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
