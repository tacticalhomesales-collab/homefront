import { NextResponse } from "next/server";
import { buildEligibilityFromInput, EligibilityProfile } from "@/lib/eligibility";
import { matchPrograms } from "@/lib/matcher";
import { CA_PROGRAMS_STATEWIDE_V0 } from "@/lib/programs/ca_statewide_v0";
import { NATIONWIDE_PROGRAMS_V0 } from "@/lib/programs/nationwide_v0";
import { buildMatchSummary } from "@/lib/matchSummary";

type MatchRequestBody = {
  input?: Record<string, any>;
  eligibility?: EligibilityProfile;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as MatchRequestBody | undefined;

    let eligibility: EligibilityProfile;

    if (body && body.eligibility) {
      eligibility = body.eligibility;
    } else {
      const rawInput = body && body.input && typeof body.input === "object" ? body.input : {};
      eligibility = buildEligibilityFromInput(rawInput);
    }


    // Helper to check if location/zip is in California
    function isCaliforniaLocation(raw: string | null | undefined): boolean {
      if (!raw) return false;
      const v = raw.trim();
      if (!v) return false;
      // If the location contains a 5-digit ZIP code, treat CA ZIP ranges as California.
      const zipMatch = v.match(/\b(\d{5})\b/);
      if (zipMatch) {
        const zip = Number(zipMatch[1]);
        if (zip >= 90001 && zip <= 96162) return true;
      }
      const lower = v.toLowerCase();
      if (/\bcalifornia\b/.test(lower)) return true;
      if (/(^|,\s*)ca\b/.test(lower)) return true;
      return false;
    }

    const location = eligibility.location || eligibility.zip || "";
    const useCA = isCaliforniaLocation(location);
    const programs = useCA ? CA_PROGRAMS_STATEWIDE_V0 : NATIONWIDE_PROGRAMS_V0;
    const result = matchPrograms(eligibility, programs);
    const summary = buildMatchSummary(result);

    return NextResponse.json({
      ok: true,
      eligibility,
      matched: result.matched,
      maybe: result.maybe,
      excluded_count: result.excluded.length,
      summary,
    });
  } catch (err: any) {
    console.error("[/api/match] Error", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

