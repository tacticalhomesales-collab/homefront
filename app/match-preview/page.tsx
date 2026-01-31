"use client";

import AppShell from "../../components/AppShell";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function MatchPreviewPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [pressed, setPressed] = useState(false);

  const formatLabel = (str: string) => {
    return (str || "")
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  // Top-level (always show when present)
  const mission = sp.get("mission") || "";
  const location = sp.get("location") || "";
  const financing = sp.get("financing") || "";

  // Service profile (full preview)
  const audience = sp.get("audience") || "";
  const branch = sp.get("branch") || "";
  const paygrade = sp.get("paygrade") || "";
  const retiring_rank = sp.get("retiring_rank") || "";
  const years_of_service = sp.get("years_of_service") || "";
  const role = sp.get("role") || "";
  const lane = sp.get("lane") || "";

  // Optional other sections (only render if present)
  const property_location = sp.get("property_location") || "";
  const property_type = sp.get("property_type") || "";
  const sell_timeline = sp.get("sell_timeline") || "";
  const sell_motivation = sp.get("sell_motivation") || "";
  const sell_status = sp.get("sell_status") || "";

  const rental_location = sp.get("rental_location") || "";
  const rental_type = sp.get("rental_type") || "";
  const rental_status = sp.get("rental_status") || "";
  const rent_band = sp.get("rent_band") || "";
  const rental_needs = sp.get("rental_needs") || "";

  const current_lender_type = sp.get("current_lender_type") || "";
  const current_rate_band = sp.get("current_rate_band") || "";
  const compare_priority = sp.get("compare_priority") || "";

  const serviceItems = useMemo(() => {
    const rows: Array<{ k: string; v: string }> = [];
    const add = (k: string, v: string) => {
      if (!v) return;
      rows.push({ k, v: formatLabel(v) });
    };

    add("Audience", audience);
    add("Branch", branch);
    add("Paygrade", paygrade);
    add("Retiring Rank", retiring_rank);
    add("Years", years_of_service);
    add("Role", role);
    add("Lane", lane);

    return rows;
  }, [audience, branch, paygrade, retiring_rank, years_of_service, role, lane]);

  const sellItems = useMemo(() => {
    const rows: Array<{ k: string; v: string }> = [];
    const add = (k: string, v: string) => {
      if (!v) return;
      rows.push({ k, v: formatLabel(v) });
    };

    add("Property Location", property_location);
    add("Property Type", property_type);
    add("Sell Timeline", sell_timeline);
    add("Motivation", sell_motivation);
    add("Sell Status", sell_status);

    return rows;
  }, [property_location, property_type, sell_timeline, sell_motivation, sell_status]);

  const rentalItems = useMemo(() => {
    const rows: Array<{ k: string; v: string }> = [];
    const add = (k: string, v: string) => {
      if (!v) return;
      rows.push({ k, v: formatLabel(v) });
    };

    add("Rental Location", rental_location);
    add("Rental Type", rental_type);
    add("Rental Status", rental_status);
    add("Rent Band", rent_band);
    add("Needs", rental_needs);

    return rows;
  }, [rental_location, rental_type, rental_status, rent_band, rental_needs]);

  const lenderItems = useMemo(() => {
    const rows: Array<{ k: string; v: string }> = [];
    const add = (k: string, v: string) => {
      if (!v) return;
      rows.push({ k, v: formatLabel(v) });
    };

    add("Lender Type", current_lender_type);
    add("Rate Band", current_rate_band);
    add("Priority", compare_priority);

    return rows;
  }, [current_lender_type, current_rate_band, compare_priority]);

  const goNext = () => {
    if (pressed) return;
    setPressed(true);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    router.push(`/verify?${q.toString()}`);
  };

  const Card = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => {
    return (
      <div className="w-[calc(100%+2.5rem)] -mx-5 bg-white/5 border border-white/15 rounded-lg px-3 py-2">
        <div className="text-[9px] uppercase tracking-wide text-white/55 font-extrabold leading-none">
          {title}
        </div>
        <div className="mt-1">{children}</div>
      </div>
    );
  };

  const CompactKVGrid = ({ rows }: { rows: Array<{ k: string; v: string }> }) => {
    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {rows.map((r) => (
          <div key={r.k} className="min-w-0">
            <div className="text-[8px] text-white/50 font-bold leading-none truncate">
              {r.k}
            </div>
            <div className="mt-[2px] text-[10px] text-white font-extrabold leading-none truncate">
              {r.v}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AppShell>
      {/* ✅ Single reliable scroller (fixes “tiny scroll” on phone) */}
      <div
        className="w-full h-[100svh] overflow-y-auto overscroll-contain touch-pan-y"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Content */}
        <div className="w-full max-w-md mx-auto px-4 pt-2 pb-24 text-center">
          <div className="pointer-events-none mb-2">
            <h1 className="text-[16px] font-extrabold leading-tight text-white">
              MATCH PREVIEW — TEST A
            </h1>
            <p className="mt-0.5 text-[11px] leading-tight text-white/70 font-semibold">
              Review your details before continuing.
            </p>
          </div>

          {/* ✅ Thin boxes */}
          <div className="flex flex-col gap-2 items-center">
            {mission && (
              <Card title="Mission">
                <div className="text-[12px] font-extrabold text-white leading-tight truncate text-left">
                  {formatLabel(mission)}
                </div>
              </Card>
            )}

            {location && (
              <Card title="Location">
                <div className="text-[12px] font-extrabold text-white leading-tight truncate text-left">
                  {formatLabel(location)}
                </div>
              </Card>
            )}

            {financing && (
              <Card title="Financing">
                <div className="text-[12px] font-extrabold text-white leading-tight truncate text-left">
                  {formatLabel(financing)}
                </div>
              </Card>
            )}

            {/* Full service profile preview in ONE compact card */}
            {(serviceItems.length > 0) && (
              <Card title="Service Profile">
                <CompactKVGrid rows={serviceItems} />
              </Card>
            )}

            {/* Optional sections (only render when present) */}
            {sellItems.length > 0 && (
              <Card title="Sell Details">
                <CompactKVGrid rows={sellItems} />
              </Card>
            )}

            {rentalItems.length > 0 && (
              <Card title="Rental Details">
                <CompactKVGrid rows={rentalItems} />
              </Card>
            )}

            {lenderItems.length > 0 && (
              <Card title="Compare Lenders">
                <CompactKVGrid rows={lenderItems} />
              </Card>
            )}

            <p className="mt-1 text-[11px] text-white/40 leading-tight w-full">
              Not affiliated with any government agency.
            </p>
          </div>
        </div>

        {/* ✅ Sticky footer button always reachable */}
        <div className="sticky bottom-0 left-0 right-0 bg-black/50 backdrop-blur px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
          <div className="w-full max-w-md mx-auto">
            <button
              type="button"
              onClick={goNext}
              disabled={pressed}
              className={[
                "w-full py-2 rounded-xl text-[13px] font-extrabold",
                "bg-[#ff385c] text-white shadow-[0_8px_20px_rgba(255,56,92,0.22)]",
                "active:scale-[0.99] transition select-none touch-manipulation",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                pressed ? "opacity-60 cursor-not-allowed" : "",
              ].join(" ")}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
