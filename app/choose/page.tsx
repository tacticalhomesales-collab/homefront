
"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
        router.push(`/military-status?lane=service&service_track=military&mission=${mission || ""}`);
      } else if (pathType === "first_responder") {
        router.push(`/first-responder?lane=service&service_track=fr&mission=${mission || ""}`);
      } else {
        // Civilian: branch based on mission param
        if (mission === "sell") {
          router.push(`/sell-property?mission=sell`);
        } else if (mission === "manage_rental") {
          router.push(`/rental-property?mission=manage_rental`);
        } else {
          // buy or rent
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

  let logoSrc = "/homefront-badge.png";
  let logoAlt = "HomeFront";
  if (selectedPath === "Military Affiliated" || selectedPath === "First Responder") {
    logoSrc = "/serving-those-who-serve-logo.png";
    logoAlt = "Serving Those Who Serve";
  } else if (selectedPath === "Civilian") {
    logoSrc = "/smart-moves-strong-homes-logo.png";
    logoAlt = "Smart Moves Strong Homes";
  }

  return (
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4">
      <div className="min-h-[100dvh] flex flex-col items-center text-center pt-8 pb-10">
        <div className="w-full max-w-[900px] relative mx-auto">
          {/* Buy • Sell • Rent • Manage row (styled gray, above logo, not wider than logo) */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 text-[12px] font-bold tracking-[-0.01em] text-gray-400 select-none mx-auto w-full max-w-[900px]" style={{maxWidth: '900px'}}>
            <span>Buy</span>
            <span className="mx-0.5">•</span>
            <span>Sell</span>
            <span className="mx-0.5">•</span>
            <span>Rent</span>
            <span className="mx-0.5">•</span>
            <span>Manage</span>
          </div>

          {/* Dynamic Logo - moved down and made larger */}
          <div className="mx-auto w-full max-w-[98vw] sm:max-w-[1100px] mt-10 mb-2 pointer-events-none select-none">
            <img
              src={logoSrc}
              alt={logoAlt}
              className="w-full h-auto"
              style={{ maxWidth: '1100px', maxHeight: '750px', objectFit: 'contain' }}
              draggable={false}
            />
          </div>

          {/* Title */}
          <div className="mt-2 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-2xl font-extrabold tracking-tight leading-none text-white">
              Choose Your Path
            </h1>
            <p className="mt-2 text-xs font-semibold text-white/70">
              Select what best describes you.
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-8 relative z-50 flex flex-col gap-5 w-full max-w-[500px] mx-auto items-center">
            {BUTTONS.map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={b.onClick}
                className={[
                  "cursor-pointer pointer-events-auto block w-full py-4 rounded-2xl border border-white/15 bg-white/10 text-white text-[16px] font-bold hover:bg-white/15 active:scale-[0.98] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 shadow-lg",
                  pressedButton === b.label ? "bg-[#ff385c] text-white" : ""
                ].join(" ")}
              >
                {b.label}
              </button>
            ))}
          </div>
          {/* Only one button container should remain. */}
        </div>
      </div>
    </main>
  );
}
