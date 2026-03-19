"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "../../components/AppShell";

type YesNoUnsure = "yes" | "no" | "unsure";
type OccupancyType = "primary" | "second_home" | "investment" | "unsure";
type IncomeBand =
  | "lt_80k"
  | "80_120k"
  | "120_160k"
  | "160_200k"
  | "200_plus"
  | "prefer_not"
  | "unsure";

const SCAN_DELAY_MS = 6000;



function buildMergedParams(
  sp: URLSearchParams,
  state: {
    firstTimeBuyer: YesNoUnsure | "";
    occupancy: OccupancyType | "";
    householdSize: string;
    incomeBand: IncomeBand | "";
  }
) {
  const q = new URLSearchParams();
  for (const [k, v] of sp.entries()) q.set(k, v);

  if (state.firstTimeBuyer) q.set("first_time_buyer", state.firstTimeBuyer);
  if (state.occupancy) q.set("occupancy", state.occupancy);
  if (state.householdSize.trim()) q.set("household_size", state.householdSize.trim());
  if (state.incomeBand) q.set("income_band", state.incomeBand);

  return q;
}

export default function ProgramsCheckPage() {
  const router = useRouter();
  const sp = useSearchParams();



  const [firstTimeBuyer, setFirstTimeBuyer] = useState<YesNoUnsure | "">("");
  const [occupancy, setOccupancy] = useState<OccupancyType | "">("");
  const [householdSize, setHouseholdSize] = useState("");
  const [incomeBand, setIncomeBand] = useState<IncomeBand | "">("");
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const scanEnabled =
    !!firstTimeBuyer &&
    !!occupancy &&
    householdSize.trim() !== "" &&
    !!incomeBand;

  const buildBaseParams = () => {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    return q;
  };

  const navigateWithParams = (path: string, useMerged: boolean) => {
    const base = buildBaseParams();
    const q = useMerged
      ? buildMergedParams(base, { firstTimeBuyer, occupancy, householdSize, incomeBand })
      : base;

    const qs = q.toString();
    const url = qs ? `${path}?${qs}` : path;
    router.push(url);
  };

  const handlePrimaryClick = () => {
    setError(null);
    if (!scanEnabled) {
      setError("Please answer all questions before continuing.");
      return;
    }
    setScanning(true);
    setTimeout(() => {
      navigateWithParams("/programs-results", true);
    }, SCAN_DELAY_MS);
  };

  const primaryLabel = "Run Scan";

  return (
    <AppShell>
      <div
        className="w-full overscroll-contain touch-pan-y"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div
          className="w-full max-w-md relative mx-auto text-left px-4 pt-1 pb-8"
          style={{ marginTop: "-0.25rem" }}
        >
          <div className="mb-2 text-center">
            <h1 className="text-xl font-extrabold text-white">Program Scan</h1>
            <p className="mt-1 text-[11px] text-white/70 max-w-xs mx-auto">
              Our AI-powered backend simultaneously searches federal, state, local, and partner programs to find potential housing benefits for your situation.
            </p>
          </div>

          <div className="space-y-3">

            <div className="border border-white/15 rounded-lg bg-white/5 px-3 pb-3 pt-2">
              <label className="block text-[11px] font-extrabold text-white/70 mb-1">
                Are you a first-time homebuyer?
              </label>
              <div className="flex gap-1.5 text-[10px]">
                {([
                  { value: "yes" as YesNoUnsure, label: "Yes" },
                  { value: "no" as YesNoUnsure, label: "No" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFirstTimeBuyer(opt.value)}
                    className={`flex-1 py-[1px] rounded border text-[9px] font-semibold transition ${
                      firstTimeBuyer === opt.value
                        ? "bg-[#ff385c] border-[#ff385c] text-white"
                        : "bg-white/5 border-white/20 text-white/80"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-white/15 rounded-lg bg-white/5 px-3 pb-3 pt-2">
              <label className="block text-[11px] font-extrabold text-white/70 mb-1">
                How will you use the home?
              </label>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {[
                  { value: "primary", label: "Primary residence" },
                  { value: "second_home", label: "Second home" },
                  { value: "investment", label: "Investment / rental" },
                  { value: "unsure", label: "Prefer not to say" },
                ].map((opt) => (
                  <button
                    key={opt.value || "none"}
                    type="button"
                    onClick={() => setOccupancy(opt.value as OccupancyType | "")}
                    className={`flex-1 min-w-[45%] py-[1px] rounded border text-[9px] font-semibold transition ${
                      occupancy === opt.value
                        ? "bg-[#ff385c] border-[#ff385c] text-white"
                        : "bg-white/5 border-white/20 text-white/80"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-white/15 rounded-lg bg-white/5 px-3 pb-3 pt-2">
              <label className="block text-[11px] font-extrabold text-white/70 mb-1">
                Household size
              </label>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {[
                  { value: "2", label: "1–3" },
                  { value: "5", label: "4–6" },
                  { value: "7", label: "7+" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setHouseholdSize(opt.value)}
                    className={`flex-1 min-w-[20%] py-[1px] rounded border text-[9px] font-semibold transition ${
                      householdSize === opt.value
                        ? "bg-[#ff385c] border-[#ff385c] text-white"
                        : "bg-white/5 border-white/20 text-white/80"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-white/15 rounded-lg bg-white/5 px-3 pb-3 pt-2">
              <label className="block text-[11px] font-extrabold text-white/70 mb-1">
                Approximate household income (before taxes)
              </label>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {[
                  { value: "lt_80k", label: "$0–$80,000" },
                  { value: "80_120k", label: "$80,000–$120,000" },
                  { value: "120_160k", label: "$120,000–$160,000" },
                  { value: "160_200k", label: "$160,000+" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setIncomeBand(opt.value as IncomeBand)}
                    className={`flex-1 min-w-[22%] py-[1px] rounded border text-[9px] font-semibold transition ${
                      incomeBand === opt.value
                        ? "bg-[#ff385c] border-[#ff385c] text-white"
                        : "bg-white/5 border-white/20 text-white/80"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={handlePrimaryClick}
              disabled={!scanEnabled || scanning}
              className={`w-full py-2 rounded-xl text-[13px] font-extrabold transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/40
                ${(!scanEnabled || scanning)
                  ? "bg-[#ff385c]/40 text-white/60 cursor-not-allowed"
                  : "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]"}
              `}
            >
              {scanning ? "Scanning programs..." : primaryLabel}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-xs text-[#ff8a8a] font-semibold text-center">
              {error}
            </p>
          )}

          {scanning && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
              <div className="w-full max-w-sm mx-4 rounded-2xl bg-[#0b0f14] border border-white/15 p-4 text-center">
                <h2 className="text-sm font-extrabold text-white mb-1">
                  Finding your housing benefits
                </h2>
                <p className="text-[11px] text-white/70 mb-4">
                  We use AI-powered search engines to scan federal, state, and local
                  government websites for the most relevant housing programs for you.
                </p>
                <div className="w-full">
                  <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 scan-bar" />
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-white/60">
                  Scanning programs. This only takes a few seconds.
                </p>
              </div>

              <style jsx>{`
                .scan-bar {
                  animation: scanBar 1.4s ease-in-out infinite;
                }

                @keyframes scanBar {
                  0% {
                    transform: translateX(-120%);
                  }
                  50% {
                    transform: translateX(0%);
                  }
                  100% {
                    transform: translateX(120%);
                  }
                }
              `}</style>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
