"use client";

import AppShell from "../../components/AppShell";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function ReviewPage() {
  const router = useRouter();
  const sp = useSearchParams();

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
      .replace(/-/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const buildEditUrl = (page: string) => {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    return `/${page}?${q.toString()}`;
  };

  const goNext = () => {
    if (pressed) return;
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

  // ✅ EXACT same outer box sizing as Financing buttons
  const boxClass =
    "block w-[calc(100%+2.5rem)] -mx-5 py-1.5 rounded-lg border border-white/15 bg-white/10";

  const Row = ({
    label,
    value,
    editHref,
  }: {
    label: string;
    value: string;
    editHref: string;
  }) => {
    return (
      <div className={boxClass}>
        <div className="px-3 flex items-center justify-between gap-2">
          {/* Slightly smaller typography */}
          <div className="text-[13px] font-extrabold text-white leading-none truncate">
            <span className="text-white/70">{label}:</span>{" "}
            <span className="text-white">{value}</span>
          </div>

          <a
            href={editHref}
            className="text-[#ff385c] text-[11px] font-extrabold leading-none hover:underline shrink-0"
          >
            Edit
          </a>
        </div>
      </div>
    );
  };

  const DetailBox = ({
    title,
    editHref,
    children,
  }: {
    title: string;
    editHref: string;
    children: React.ReactNode;
  }) => {
    return (
      <div className={boxClass}>
        <div className="px-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[13px] font-extrabold text-white leading-none">
              {title}
            </div>
            <a
              href={editHref}
              className="text-[#ff385c] text-[11px] font-extrabold leading-none hover:underline shrink-0"
            >
              Edit
            </a>
          </div>

          {/* Compact details text */}
          <div className="mt-1 text-[10px] font-semibold text-white/70 leading-tight space-y-1">
            {children}
          </div>
        </div>
      </div>
    );
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

        {/* Remove all vertical spacing above cards */}
        <div className="flex flex-col gap-1 w-full m-0 p-0 text-left">
          {mission && (
            <Row
              label="Mission"
              value={formatLabel(mission)}
              editHref={buildEditUrl("mission")}
            />
          )}

          {location && (
            <Row
              label="Location"
              value={location}
              editHref={buildEditUrl("location")}
            />
          )}

          {financing && (
            <Row
              label="Financing"
              value={formatLabel(financing)}
              editHref={buildEditUrl("financing-status")}
            />
          )}

          {/* Service Profile */}
          {serviceItems.length > 0 && (
            <DetailBox
              title="Service Profile"
              editHref={buildEditUrl(role ? "first-responder" : "audience")}
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {serviceItems.map((r) => (
                  <div key={r.k} className="min-w-0">
                    <div className="text-white/60 text-[10px] font-bold leading-none truncate">
                      {r.k}
                    </div>
                    <div className="mt-[2px] text-white text-[12px] font-extrabold leading-none truncate">
                      {r.v}
                    </div>
                  </div>
                ))}
              </div>
            </DetailBox>
          )}

          {/* Sell Details */}
          {mission === "sell" && property_location && (
            <DetailBox title="Property Details" editHref={buildEditUrl("sell-property")}>
              <div className="text-white text-[12px] font-extrabold leading-none truncate">
                {property_location}
              </div>
              {property_type && <div>Type: {formatLabel(property_type)}</div>}
              {sell_timeline && <div>Timeline: {formatLabel(sell_timeline)}</div>}
              {sell_motivation && <div>Reason: {formatLabel(sell_motivation)}</div>}
              {sell_status && <div>Status: {formatLabel(sell_status)}</div>}
            </DetailBox>
          )}

          {/* Rental / Manage */}
          {mission === "manage_rental" && rental_location && (
            <DetailBox title="Rental Property" editHref={buildEditUrl("rental-property")}>
              <div className="text-white text-[12px] font-extrabold leading-none truncate">
                {rental_location}
              </div>
              {rental_type && <div>Type: {formatLabel(rental_type)}</div>}
              {rental_status && <div>Status: {formatLabel(rental_status)}</div>}
              {rent_band && <div>Rent: {rent_band}/mo</div>}
              {rental_needs && (
                <div>
                  Needs: {rental_needs.split(",").map(formatLabel).join(", ")}
                </div>
              )}
            </DetailBox>
          )}

          {/* Compare Lenders */}
          {current_lender_type && (
            <DetailBox title="Lender Comparison" editHref={buildEditUrl("compare-lenders")}>
              <div className="text-white text-[12px] font-extrabold leading-none truncate">
                {formatLabel(current_lender_type)}
              </div>
              {current_rate_band && <div>Rate: {formatLabel(current_rate_band)}</div>}
              {compare_priority && (
                <div>
                  Priorities: {compare_priority.split(",").map(formatLabel).join(", ")}
                </div>
              )}
            </DetailBox>
          )}
        </div>

        {/* ✅ Button matches Financing sizing (NOT big py-4 / 21px) */}
        <button
          type="button"
          disabled={pressed}
          onClick={goNext}
          className={[
            "cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-2 rounded-xl",
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

        <p className="mt-5 text-[11px] text-white/45">
          Not affiliated with any government agency.
        </p>
      </div>
    </AppShell>
  );
}
