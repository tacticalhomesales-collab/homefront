"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "../../components/AppShell";

import type { EligibilityProfile } from "@/lib/eligibility";
import type { ProgramMatch } from "@/lib/matcher";
import type { MatchSummary } from "@/lib/matchSummary";

type MatchResponse = {
  ok: boolean;
  schema_version?: number;
  eligibility?: EligibilityProfile | null;
  matches?: ProgramMatch[];
  summary?: MatchSummary;
  error?: string;
};

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return value;
}

function renderContactBlock(contactText?: string) {
  if (!contactText) return null;

  const segments = contactText.split(",").map((segment) => segment.trim());
  const name = segments.find((segment) => !segment.toLowerCase().startsWith("nmlsr id"));
  const license = segments.find((segment) => segment.toLowerCase().startsWith("nmlsr id"));
  const phoneRaw = segments.find((segment) => /\d/.test(segment) && !segment.toLowerCase().startsWith("nmlsr id"));

  return (
    <div className="text-[11px] text-[#ffd7a1] font-semibold leading-relaxed">
      {name && <div>Wells Fargo contact: {name}</div>}
      {phoneRaw && <div>{formatPhoneNumber(phoneRaw)}</div>}
      {license && <div>{license}</div>}
    </div>
  );
}

export default function ScanPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MatchResponse | null>(null);

  useEffect(() => {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);

    const controller = new AbortController();

    async function run() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/match?${q.toString()}`, {
          method: "GET",
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const json = (await res.json()) as MatchResponse;
        if (!json.ok) {
          throw new Error(json.error || "Match API returned an error.");
        }
        setData(json);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("[ScanPage] Match error", err);
        setError(err?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    run();

    return () => {
      controller.abort();
    };
  }, [sp]);

  const handleBack = () => {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    router.push(`/review?${q.toString()}`);
  };

  const summary = data?.summary;

  // Older scan UI expects arrays of matched/possible programs; the current
  // MatchSummary type only carries aggregate counts, so we defensively
  // normalize to empty arrays when those collections are missing.
  // Use matches from data, fallback to empty arrays
  const matchedList: ProgramMatch[] = Array.isArray(data?.matches) ? data?.matches : [];
  // If you have a 'possible' or 'maybe' list, add it here. Otherwise, leave as empty array.
  const possibleList: ProgramMatch[] = [];

  return (
    <AppShell>
      <div className="w-full max-w-md relative mx-auto text-center px-4 pt-0 pb-10" style={{ marginTop: "-0.75rem" }}>
        <div className="flex flex-col items-center justify-center pointer-events-none m-0 p-0">
          <h1 className="text-2xl font-extrabold tracking-tight leading-none text-white m-0 p-0">
            Program Scan
          </h1>
          <p className="mt-2 text-xs font-semibold text-white/70 max-w-sm">
            Were comparing your mission and profile against a small library of
            verified programs. This is informational only, not legal or
            financing advice.
          </p>
        </div>

        {loading && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <div className="text-sm font-semibold text-white/80">
              Scanning for matches5
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/40 text-left rounded-lg px-3 py-2">
            <div className="text-xs font-bold text-red-300 mb-1">We hit a snag</div>
            <div className="text-xs text-red-200/90">{error}</div>
          </div>
        )}

        {!loading && !error && summary && (
          <div className="mt-4 flex flex-col gap-3 text-left">
            {matchedList.length > 0 && (
              <section className="bg-white/10 border border-white/15 rounded-lg px-3 py-2">
                <h2 className="text-xs font-extrabold text-green-300 uppercase tracking-wide mb-1">
                  Strong Potential Fits
                </h2>
                <ul className="space-y-1.5">
                  {matchedList.map((m: ProgramMatch) => (
                    <li key={m.program_id} className="text-xs text-white/90">
                      <div className="font-extrabold text-[11px] mb-0.5">
                        {m.name}
                      </div>
                      <div className="text-[11px] text-white/80">
                        {m.assistance_max_text}
                      </div>
                      {renderContactBlock(m.contact_text)}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {possibleList.length > 0 && (
              <section className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <h2 className="text-xs font-extrabold text-yellow-200 uppercase tracking-wide mb-1">
                  Worth Exploring
                </h2>
                <ul className="space-y-1.5">
                  {possibleList.map((m: ProgramMatch) => (
                    <li key={m.program_id} className="text-xs text-white/90">
                      <div className="font-extrabold text-[11px] mb-0.5">
                        {m.name}
                      </div>
                      <div className="text-[11px] text-white/80">
                        {m.assistance_max_text}
                      </div>
                      {renderContactBlock(m.contact_text)}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {matchedList.length === 0 && possibleList.length === 0 && (
              <section className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <h2 className="text-xs font-extrabold text-white/80 uppercase tracking-wide mb-1">
                  No Clear Matches Yet
                </h2>
                <p className="text-[11px] text-white/70">
                  We didnt find any strong matches in this v0 library based on the
                  details provided so far. That doesnt mean youre not eligible  it
                  just means wed want a human to take a closer look.
                </p>
              </section>
            )}

            <p className="text-[10px] text-white/45">
              Results are estimates based on the information you shared and a
              small, hand-curated set of programs. They are not legal, tax, or
              financing advice.
            </p>
          </div>
        )}

        <div className="mt-5 w-full flex justify-center">
          <div className="w-full max-w-xs flex flex-col gap-2">
            <button
              type="button"
              onClick={handleBack}
              className="cursor-pointer block w-full py-2 rounded-xl text-[13px] font-extrabold bg-white/10 text-white hover:bg-white/15 active:scale-[0.99] transition focus:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
            >
              Back to Match Preview
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
