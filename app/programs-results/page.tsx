"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "../../components/AppShell";




type ProgramMatch = {
  program_id: string;
  name: string;
  category: string;
  geography: string;
  assistance_max_text: string;
  contact_text?: string;
  official_urls: string[];
  status: "open" | "closed" | "unknown";
  why: string[];
  missing_fields: string[];
};

type MatchSummary = {
  matched_count: number;
  maybe_count: number;
  headline: string;
  potential_value_text: string;
  computed_at: string;
};

type MatchResponse = {
  ok: boolean;
  eligibility?: any;
  matched?: ProgramMatch[];
  maybe?: ProgramMatch[];
  excluded_count?: number;
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
    <div className="mb-1 text-[9px] text-[#ffd7a1] font-semibold leading-relaxed">
      {name && <div>Wells Fargo contact: {name}</div>}
      {phoneRaw && <div>{formatPhoneNumber(phoneRaw)}</div>}
      {license && <div>{license}</div>}
    </div>
  );
}

export default function ProgramResultsPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [response, setResponse] = useState<MatchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    const query = sp.toString();
    const url = query ? `/contact?${query}` : "/contact";
    router.push(url);
  };

  useEffect(() => {
    const run = async () => {
      try {
        setError(null);
        const input = Object.fromEntries(sp.entries());

        const res = await fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input }),
        });

        const json: MatchResponse = await res.json().catch(() => ({ ok: false }));
        if (!res.ok || !json.ok) {
          setError(json.error || "Unable to load program results right now.");
          setResponse(null);
        } else {
          setResponse(json);
        }
      } catch {
        setError("Unable to load program results right now.");
        setResponse(null);
      }
    };

    run();
  }, [sp]);

  return (
    <AppShell>
      <div
        className="w-full overscroll-contain touch-pan-y"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="w-full max-w-md relative mx-auto text-left px-4 pt-4 pb-10">
          <div className="space-y-3">
            {error && (
              <p className="text-xs text-[#ff8a8a] font-semibold text-center">{error}</p>
            )}

            {response && (
              <div className="mb-1 text-center">
                <p className="text-sm font-extrabold text-white">
                  You may qualify for{" "}
                  {(response.summary?.matched_count ?? 0) +
                    (response.summary?.maybe_count ?? 0)}{" "}
                  programs
                </p>
              </div>
            )}

            {response && response.matched && response.matched.length > 0 && (
              <div className="bg-white/5 border border-white/15 rounded-xl p-2">
                <h3 className="text-[11px] font-extrabold text-white mb-1">Matched programs</h3>
                <div className="space-y-1.5">
                  {response.matched.map((p) => (
                    <div
                      key={p.program_id}
                      className="rounded-md bg-black/30 border border-white/15 p-2"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div>
                          <div className="text-[10px] font-extrabold text-white">{p.name}</div>
                          <div className="text-[9px] text-white/60">{p.geography}</div>
                        </div>
                        <span className="text-[8px] px-2 py-[1px] rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                          {p.status === "open"
                            ? "Open"
                            : p.status === "closed"
                            ? "Closed"
                            : "Check details"}
                        </span>
                      </div>
                      <p className="text-[9px] text-white/80 mb-1">{p.assistance_max_text}</p>
                      {renderContactBlock(p.contact_text)}
                      {p.official_urls.length > 0 && (
                        <div className="mt-1 text-[9px] text-[#7bdcff]">
                          {p.official_urls.map((url) => (
                            <a
                              key={url}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="underline mr-2"
                            >
                              Program details
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {response && response.maybe && response.maybe.length > 0 && (
              <div className="bg-white/5 border border-white/15 rounded-xl p-2">
                <h3 className="text-[11px] font-extrabold text-white mb-1">Worth exploring</h3>
                <div className="space-y-1.5">
                  {response.maybe.map((p) => (
                    <div
                      key={p.program_id}
                      className="rounded-md bg-black/30 border border-white/15 p-2"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div>
                          <div className="text-[10px] font-extrabold text-white">{p.name}</div>
                          <div className="text-[9px] text-white/60">{p.geography}</div>
                        </div>
                        <span className="text-[8px] px-2 py-[1px] rounded-full bg-amber-500/20 text-amber-200 font-bold">
                          Needs details
                        </span>
                      </div>
                      <p className="text-[9px] text-white/80 mb-1">{p.assistance_max_text}</p>
                      {renderContactBlock(p.contact_text)}
                      {p.missing_fields.length > 0 && (
                        <p className="mt-1 text-[9px] text-white/60">
                          Missing: {p.missing_fields.join(", ")}
                        </p>
                      )}
                      {p.official_urls.length > 0 && (
                        <div className="mt-1 text-[9px] text-[#7bdcff]">
                          {p.official_urls.map((url) => (
                            <a
                              key={url}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="underline mr-2"
                            >
                              Program details
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full py-2 rounded-xl bg-[#ff385c] text-white text-[13px] font-extrabold shadow-[0_10px_30px_rgba(255,56,92,0.25)] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/40"
              >
                Continue
              </button>
            </div>


          </div>
        </div>
      </div>
    </AppShell>
  );
}
