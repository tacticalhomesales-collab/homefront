"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ReviewPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pressed, setPressed] = useState(false);
  const [active, setActive] = useState(false);

  // Extract key params
  const mission = sp.get("mission") || "";
  const location = sp.get("location") || "";
  const financing = sp.get("financing") || "";
  const audience = sp.get("audience") || "";
  const branch = sp.get("branch") || "";
  const paygrade = sp.get("paygrade") || "";
  const retiring_rank = sp.get("retiring_rank") || "";
  const years_of_service = sp.get("years_of_service") || "";
  const role = sp.get("role") || "";
  const lane = sp.get("lane") || "";

  // Sell flow params
  const property_location = sp.get("property_location") || "";
  const property_type = sp.get("property_type") || "";
  const sell_timeline = sp.get("sell_timeline") || "";
  const sell_motivation = sp.get("sell_motivation") || "";
  const sell_status = sp.get("sell_status") || "";

  // Manage/rental params
  const rental_location = sp.get("rental_location") || "";
  const rental_type = sp.get("rental_type") || "";
  const rental_status = sp.get("rental_status") || "";
  const rent_band = sp.get("rent_band") || "";
  const rental_needs = sp.get("rental_needs") || "";

  // Compare lenders params
  const current_lender_type = sp.get("current_lender_type") || "";
  const current_rate_band = sp.get("current_rate_band") || "";
  const compare_priority = sp.get("compare_priority") || "";

  const goNext = () => {
    if (pressed) return;

    setActive(true);
    setPressed(true);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);

    const nextUrl = `/consent?${q.toString()}`;

    setTimeout(() => {
      try {
        router.push(nextUrl);
      } finally {
        setTimeout(() => {
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.startsWith("/consent")
          ) {
            window.location.assign(nextUrl);
          }
        }, 250);
      }
    }, 120);
  };

  const buildEditUrl = (page: string) => {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    return `/${page}?${q.toString()}`;
  };

  const formatLabel = (str: string) => {
    return str
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4">
      <div className="min-h-[100dvh] flex flex-col items-center text-center pt-8 pb-10">
        <div className="w-full max-w-md relative">
          {/* Invisible spacer row */}
          <div className="mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[18px] font-extrabold tracking-[-0.02em] text-white/80 opacity-0 pointer-events-none select-none">
            <span>Buy</span>
            <span className="text-white/25">•</span>
            <span>Sell</span>
            <span className="text-white/25">•</span>
            <span>Rent</span>
            <span className="text-white/25">•</span>
            <span>Manage</span>
          </div>

          {/* Logo */}
          <div className="mx-auto w-full max-w-[95vw] mt-16 pointer-events-none select-none">
            <img
              src="/homefront-badge.png"
              alt="HomeFront"
              className="w-full h-auto scale-200 origin-center"
              draggable={false}
            />
          </div>

          {/* Title */}
          <div className="-mt-6 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-4xl font-extrabold tracking-tight leading-none text-white">
              Review
            </h1>
            <p className="mt-3 text-sm font-semibold text-white/70">
              Confirm your information before continuing.
            </p>
          </div>

          {/* Review Cards */}
          <div className="mt-5 relative z-50 flex flex-col gap-3 text-left">
            {/* Mission */}
            {mission && (
              <div className="w-[calc(100%+2.5rem)] -mx-5 rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wide">Mission</p>
                    <p className="text-lg font-extrabold text-white capitalize mt-1">
                      {formatLabel(mission)}
                    </p>
                  </div>
                  <a
                    href={buildEditUrl("mission")}
                    className="text-[#ff385c] text-sm font-bold hover:underline"
                  >
                    Edit
                  </a>
                </div>
              </div>
            )}

            {/* Location */}
            {location && (
              <div className="w-[calc(100%+2.5rem)] -mx-5 rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wide">Location</p>
                    <p className="text-lg font-extrabold text-white mt-1">{location}</p>
                  </div>
                  <a
                    href={buildEditUrl("location")}
                    className="text-[#ff385c] text-sm font-bold hover:underline"
                  >
                    Edit
                  </a>
                </div>
              </div>
            )}

            {/* Financing */}
            {financing && (
              <div className="w-[calc(100%+2.5rem)] -mx-5 rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wide">Financing</p>
                    <p className="text-lg font-extrabold text-white capitalize mt-1">
                      {formatLabel(financing)}
                    </p>
                  </div>
                  <a
                    href={buildEditUrl("financing-status")}
                    className="text-[#ff385c] text-sm font-bold hover:underline"
                  >
                    Edit
                  </a>
                </div>
              </div>
            )}

            {/* Service Info (if applicable) */}
            {(audience || branch || paygrade || retiring_rank || years_of_service || role) && (
              <div className="w-[calc(100%+2.5rem)] -mx-5 rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wide mb-1">
                      Service Profile
                    </p>
                    {audience && (
                      <p className="text-base font-extrabold text-white capitalize">
                        {formatLabel(audience)}
                      </p>
                    )}
                    {role && (
                      <p className="text-base font-extrabold text-white">{role}</p>
                    )}
                    {branch && (
                      <p className="text-sm font-semibold text-white/70 mt-1">{branch}</p>
                    )}
                    {(paygrade || retiring_rank) && (
                      <p className="text-sm font-semibold text-white/70">
                        Rank: {paygrade || retiring_rank}
                      </p>
                    )}
                    {years_of_service && (
                      <p className="text-sm font-semibold text-white/70">
                        Years of Service: {years_of_service}
                      </p>
                    )}
                  </div>
                  <a
                    href={buildEditUrl(role ? "first-responder" : "audience")}
                    className="text-[#ff385c] text-sm font-bold hover:underline"
                  >
                    Edit
                  </a>
                </div>
              </div>
            )}

            {/* Sell Flow Info */}
            {mission === "sell" && property_location && (
              <div className="w-[calc(100%+2.5rem)] -mx-5 rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wide mb-1">
                      Property Details
                    </p>
                    <p className="text-base font-extrabold text-white">{property_location}</p>
                    {property_type && (
                      <p className="text-sm font-semibold text-white/70 mt-1">{property_type}</p>
                    )}
                    {sell_timeline && (
                      <p className="text-sm font-semibold text-white/70">
                        Timeline: {formatLabel(sell_timeline)}
                      </p>
                    )}
                    {sell_motivation && (
                      <p className="text-sm font-semibold text-white/70">
                        Reason: {formatLabel(sell_motivation)}
                      </p>
                    )}
                    {sell_status && (
                      <p className="text-sm font-semibold text-white/70">
                        Status: {formatLabel(sell_status)}
                      </p>
                    )}
                  </div>
                  <a
                    href={buildEditUrl("sell-property")}
                    className="text-[#ff385c] text-sm font-bold hover:underline"
                  >
                    Edit
                  </a>
                </div>
              </div>
            )}

            {/* Rental/Manage Flow Info */}
            {mission === "manage_rental" && rental_location && (
              <div className="w-[calc(100%+2.5rem)] -mx-5 rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wide mb-1">
                      Rental Property
                    </p>
                    <p className="text-base font-extrabold text-white">{rental_location}</p>
                    {rental_type && (
                      <p className="text-sm font-semibold text-white/70 mt-1">{rental_type}</p>
                    )}
                    {rental_status && (
                      <p className="text-sm font-semibold text-white/70">
                        Status: {formatLabel(rental_status)}
                      </p>
                    )}
                    {rent_band && (
                      <p className="text-sm font-semibold text-white/70">
                        Rent: {rent_band}/mo
                      </p>
                    )}
                    {rental_needs && (
                      <p className="text-sm font-semibold text-white/70">
                        Needs: {rental_needs.split(",").map(formatLabel).join(", ")}
                      </p>
                    )}
                  </div>
                  <a
                    href={buildEditUrl("rental-property")}
                    className="text-[#ff385c] text-sm font-bold hover:underline"
                  >
                    Edit
                  </a>
                </div>
              </div>
            )}

            {/* Compare Lenders Info */}
            {current_lender_type && (
              <div className="w-[calc(100%+2.5rem)] -mx-5 rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wide mb-1">
                      Lender Comparison
                    </p>
                    <p className="text-base font-extrabold text-white">{current_lender_type}</p>
                    {current_rate_band && (
                      <p className="text-sm font-semibold text-white/70 mt-1">
                        Rate: {current_rate_band}
                      </p>
                    )}
                    {compare_priority && (
                      <p className="text-sm font-semibold text-white/70">
                        Priorities: {compare_priority.split(",").map(formatLabel).join(", ")}
                      </p>
                    )}
                  </div>
                  <a
                    href={buildEditUrl("compare-lenders")}
                    className="text-[#ff385c] text-sm font-bold hover:underline"
                  >
                    Edit
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="mt-5 w-[calc(100%+2.5rem)] -mx-5">
            <button
              type="button"
              disabled={pressed}
              onClick={goNext}
              className={[
                "cursor-pointer pointer-events-auto block w-full py-4 rounded-2xl",
                "text-[21px] font-extrabold active:scale-[0.99] transition",
                "select-none touch-manipulation",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                pressed
                  ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                  : active
                  ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]"
                  : "border border-white/15 bg-white/10 text-white hover:bg-white/15",
              ].join(" ")}
            >
              Looks Good
            </button>
          </div>

          <p className="mt-5 text-[11px] text-white/45">
            Not affiliated with any government agency.
          </p>
        </div>
      </div>
    </main>
  );
}
