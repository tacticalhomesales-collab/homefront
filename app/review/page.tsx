"use client";

import AppShell from "../../components/AppShell";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function ReviewPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const buildEditUrl = (page: string) => {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    return `/${page}?${q.toString()}`;
  };

  const [pressed, setPressed] = useState(false);

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

  const formatLabel = (str: string) => {
    return (str || "")
      .replace(/_/g, " ")
      .replace(/-/g, " ");
  };

  const goNext = () => {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);

    const qs = q.toString();

    // Only send "Buy" missions through the Programs eligibility questions.
    // All other missions skip directly to contact.
    const missionForNext = (sp.get("mission") || "").toLowerCase();
    const basePath = missionForNext === "buy" ? "/programs-check" : "/contact";
    const nextUrl = qs ? `${basePath}?${qs}` : basePath;

    setTimeout(() => {
      try {
        router.push(nextUrl);
      } finally {
        setTimeout(() => {
          if (typeof window !== "undefined" && !window.location.pathname.startsWith(basePath)) {
            window.location.assign(nextUrl);
          }
        }, 250);
      }
    }, 120);
  };

  const handlePrimaryClick = () => {
    if (pressed) return;
    setPressed(true);
    goNext();
  };

  const serviceItems = useMemo(() => {
    const rows: Array<{ k: string; v: string }> = [];
    const add = (k: string, v: string) => {
      if (!v) return;
      rows.push({ k, v: formatLabel(v) });
    };

    add("Audience", audience);
    add("Role", role);
    add("Branch", branch);
    add("Paygrade", paygrade);
    add("Retiring Rank", retiring_rank);
    add("Years", years_of_service);
    add("Lane", lane);

    return rows;
  }, [audience, role, branch, paygrade, retiring_rank, years_of_service, lane]);

  // For Buy missions, skip Match Preview entirely and go straight
  // to the Programs eligibility questions.
  const missionValue = (sp.get("mission") || "").toLowerCase();
  if (typeof window !== "undefined" && missionValue === "buy") {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    const qs = q.toString();
    const url = qs ? `/programs-check?${qs}` : "/programs-check";
    router.replace(url);
    return null;
  }

  return (
    <AppShell>
      {/* ✅ EXACT same wrapper as Financing page */}
      <div className="w-full max-w-md relative mx-auto text-center px-4 pt-0 pb-10">
        {/* Remove all vertical spacing between logo and header/cards */}
        <div className="flex flex-col items-center justify-center pointer-events-none m-0 p-0">
          <h1 className="text-2xl font-extrabold tracking-tight leading-none text-white m-0 p-0">
            Match Preview
          </h1>
        </div>

        {/* Single compact summary card */}
        <div className="mt-3 flex flex-col items-center w-full m-0 p-0 text-left">
          <div className="w-full max-w-xs bg-white/10 border border-white/15 rounded-lg px-3 py-2 space-y-2">
            {/* Top-level rows */}
            {mission && (
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] font-extrabold text-white leading-none truncate">
                  <span className="text-white/70">Mission:</span>{" "}
                  <span className="text-white">{formatLabel(mission)}</span>
                </div>
                <a
                  href={buildEditUrl("mission")}
                  className="text-[#ff385c] text-[10px] font-extrabold leading-none hover:underline shrink-0"
                >
                  Edit
                </a>
              </div>
            )}

            {location && (
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] font-extrabold text-white leading-none truncate">
                  <span className="text-white/70">Location:</span>{" "}
                  <span className="text-white">{location}</span>
                </div>
                <a
                  href={buildEditUrl("location")}
                  className="text-[#ff385c] text-[10px] font-extrabold leading-none hover:underline shrink-0"
                >
                  Edit
                </a>
              </div>
            )}

            {financing && (
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] font-extrabold text-white leading-none truncate">
                  <span className="text-white/70">Financing:</span>{" "}
                  <span className="text-white">{formatLabel(financing)}</span>
                </div>
                <a
                  href={buildEditUrl("financing-status")}
                  className="text-[#ff385c] text-[10px] font-extrabold leading-none hover:underline shrink-0"
                >
                  Edit
                </a>
              </div>
            )}

            {/* Service Profile */}
            {serviceItems.length > 0 && (
              <div className="pt-2 mt-1 border-t border-white/10">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-[10px] font-extrabold text-white/80 leading-none">
                    Service Profile
                  </div>
                  <a
                    href={buildEditUrl(role ? "first-responder" : "audience")}
                    className="text-[#ff385c] text-[10px] font-extrabold leading-none hover:underline shrink-0"
                  >
                    Edit
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                  {serviceItems.map((r) => (
                    <div key={r.k} className="min-w-0">
                      <div className="text-white/60 font-bold leading-none truncate">
                        {r.k}
                      </div>
                      <div className="mt-[2px] text-white text-[11px] font-extrabold leading-none truncate">
                        {r.v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sell Details */}
            {mission === "sell" && property_location && (
              <div className="pt-2 mt-1 border-t border-white/10 space-y-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-[10px] font-extrabold text-white/80 leading-none">
                    Property Details
                  </div>
                  <a
                    href={buildEditUrl("sell-property")}
                    className="text-[#ff385c] text-[10px] font-extrabold leading-none hover:underline shrink-0"
                  >
                    Edit
                  </a>
                </div>
                <div className="text-white text-[11px] font-extrabold leading-none truncate">
                  {property_location}
                </div>
                {property_type && (
                  <div className="text-[10px] text-white/80">Type: {formatLabel(property_type)}</div>
                )}
                {sell_timeline && (
                  <div className="text-[10px] text-white/80">Timeline: {formatLabel(sell_timeline)}</div>
                )}
                {sell_motivation && (
                  <div className="text-[10px] text-white/80">Reason: {formatLabel(sell_motivation)}</div>
                )}
                {sell_status && (
                  <div className="text-[10px] text-white/80">Status: {formatLabel(sell_status)}</div>
                )}
              </div>
            )}

            {/* Rental / Manage */}
            {mission === "manage_rental" && rental_location && (
              <div className="pt-2 mt-1 border-t border-white/10 space-y-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-[10px] font-extrabold text-white/80 leading-none">
                    Rental Property
                  </div>
                  <a
                    href={buildEditUrl("rental-property")}
                    className="text-[#ff385c] text-[10px] font-extrabold leading-none hover:underline shrink-0"
                  >
                    Edit
                  </a>
                </div>
                <div className="text-white text-[11px] font-extrabold leading-none truncate">
                  {rental_location}
                </div>
                {rental_type && (
                  <div className="text-[10px] text-white/80">Type: {formatLabel(rental_type)}</div>
                )}
                {rental_status && (
                  <div className="text-[10px] text-white/80">Status: {formatLabel(rental_status)}</div>
                )}
                {rent_band && (
                  <div className="text-[10px] text-white/80">Rent: {rent_band}/mo</div>
                )}
                {rental_needs && (
                  <div className="text-[10px] text-white/80">
                    Needs: {rental_needs.split(",").map(formatLabel).join(", ")}
                  </div>
                )}
              </div>
            )}

            {/* Compare Lenders */}
            {current_lender_type && (
              <div className="pt-2 mt-1 border-t border-white/10 space-y-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-[10px] font-extrabold text-white/80 leading-none">
                    Lender Comparison
                  </div>
                  <a
                    href={buildEditUrl("compare-lenders")}
                    className="text-[#ff385c] text-[10px] font-extrabold leading-none hover:underline shrink-0"
                  >
                    Edit
                  </a>
                </div>
                <div className="text-white text-[11px] font-extrabold leading-none truncate">
                  {formatLabel(current_lender_type)}
                </div>
                {current_rate_band && (
                  <div className="text-[10px] text-white/80">Rate: {formatLabel(current_rate_band)}</div>
                )}
                {compare_priority && (
                  <div className="text-[10px] text-white/80">
                    Priorities: {compare_priority.split(",").map(formatLabel).join(", ")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ✅ Button matches card width with small gap */}
        <div className="mt-3 w-full flex justify-center">
          <div className="w-full max-w-xs flex flex-col gap-2">
            <button
              type="button"
              disabled={pressed}
              onClick={handlePrimaryClick}
              className={[
                "cursor-pointer pointer-events-auto block w-full py-2 rounded-xl",
                "text-[15px] font-extrabold active:scale-[0.99] transition",
                "select-none touch-manipulation",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                pressed
                  ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                  : "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]",
              ].join(" ")}
            >
              Looks Good
            </button>
          </div>
        </div>

        <p className="mt-5 text-[11px] text-white/45 text-center">
          Not affiliated with any government agency.
        </p>
      </div>
    </AppShell>
  );
}
