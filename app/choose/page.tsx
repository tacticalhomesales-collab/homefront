

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
      pathType: "military",
    },
    {
      label: "First Responder",
      pathType: "first_responder",
    },
    {
      label: "Medical & Healthcare",
      pathType: "medical",
    },
    {
      label: "Teachers & Education",
      pathType: "teachers",
    },
    {
      label: "Ministry",
      pathType: "ministry",
    },
    {
      label: "Community Volunteer",
      pathType: "public_servant",
    },
    {
      label: "Civilian",
      pathType: "civilian",
    },
  ];

  function handleBranch(pathType: string) {
    setSelectedPath(pathType);
    setPressedButton(pathType);
    setTimeout(() => {
      setPressedButton(null);
      // Branch to the correct next step based on mission and pathType
      const q = new URLSearchParams();
      for (const [k, v] of sp.entries()) q.set(k, v);
      const currentMission = mission || "buy";

      if (pathType === "military") {
        q.set("lane", "service");
        q.set("service_track", "military");
        q.set("mission", currentMission);
        router.push(`/military-status?${q.toString()}`);
      } else if (pathType === "first_responder") {
        q.set("lane", "service");
        q.set("service_track", "fr");
        q.set("mission", currentMission);
        router.push(`/first-responder?${q.toString()}`);
      } else if (pathType === "ministry") {
        q.set("mission", currentMission);
        router.push(`/ministry-organization?${q.toString()}`);
      } else if (pathType === "teachers") {
        q.set("lane", "service");
        q.set("service_track", "public_servant");
        q.set("mission", currentMission);
        q.set("role", "teacher");
        router.push(`/education-role?${q.toString()}`);
      } else if (pathType === "medical") {
        q.set("lane", "service");
        q.set("service_track", "public_servant");
        q.set("mission", currentMission);
        q.set("role", "nurse_healthcare");
        router.push(`/medical-role?${q.toString()}`);
      } else if (pathType === "public_servant") {
        q.set("lane", "service");
        q.set("service_track", "public_servant");
        q.set("mission", currentMission);
        q.set("role", "community_volunteer");
        router.push(`/public-servant-organization?${q.toString()}`);
      } else {
        // Civilian: branch based on mission param
        if (mission === "sell") {
          q.set("mission", "sell");
          router.push(`/sell-property?${q.toString()}`);
        } else if (mission === "manage" || mission === "manage_rental") {
          q.set("mission", "manage");
          router.push(`/rental-property?${q.toString()}`);
        } else if (mission === "rent") {
          // Civilian renter path: go straight into rent flow (no military questions)
          q.set("mission", "rent");
          router.push(`/location?${q.toString()}`);
        } else {
          // Default to buy flow
          q.set("mission", currentMission);
          // Ensure all buy routes include Home Preferences
          router.push(`/home-preferences?${q.toString()}`);
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
      <div className="w-full max-w-md mx-auto flex flex-col items-center pt-1" style={{ marginTop: "-0.5rem" }}>
        <h1 className="text-xl font-extrabold text-center mb-1 text-white">Choose Your Path</h1>
        <div className="text-sm text-white/80 text-center mb-2 font-semibold">Select what best describes you.</div>
        <div className="w-full flex flex-col gap-1.5 mt-1 items-center">
          {BUTTONS.map((b) => (
            <div key={b.label} className="w-full max-w-xs">
              <button
                type="button"
                onClick={() => handleBranch(b.pathType)}
                disabled={pressedButton === b.pathType}
                className={[
                  "cursor-pointer pointer-events-auto block w-full py-1 rounded-xl text-sm font-extrabold active:scale-[0.99] transition select-none touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30",
                  pressedButton === b.pathType
                    ? "bg-[#ff385c] text-white shadow-[0_4px_10px_rgba(255,56,92,0.18)]"
                    : "border border-white/15 bg-white/10 text-white hover:bg-white/15",
                ].join(" ")}
                style={{ fontSize: "clamp(12px,2.4vw,14px)" }}
                aria-pressed={pressedButton === b.pathType}
              >
                {b.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
