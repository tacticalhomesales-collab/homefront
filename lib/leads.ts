import { supabaseAdmin } from "@/lib/supabaseServer";
import { ensureReferrer } from "@/lib/referrers";
import { createHash } from "crypto";
import {
	buildEligibilityFromInput,
	ELIGIBILITY_SCHEMA_VERSION,
	EligibilityProfile,
} from "@/lib/eligibility";
import { matchPrograms, MatchResult } from "@/lib/matcher";
import { buildMatchSummary, MatchSummary } from "@/lib/matchSummary";
import { CA_PROGRAMS_STATEWIDE_V0 } from "@/lib/programs/ca_statewide_v0";

export type LeadPayload = {
	lead_name: string;
	lead_phone: string;
	lead_email?: string | null;
	ref_code?: string | null;
  journey?: Record<string, any> | null;
  notes?: string | null;
};

function buildContactHash(phone: string | null | undefined, email: string | null | undefined): string | null {
	const normalizedEmail = (email || "").trim().toLowerCase();
	const normalizedPhone = (phone || "").replace(/\D+/g, "");
	const basis = normalizedEmail || normalizedPhone;
	if (!basis) return null;
	return createHash("sha256").update(basis).digest("hex");
}

function isCaliforniaLocation(raw: string | null | undefined): boolean {
	if (!raw) return false;
	const v = String(raw).trim();
	if (!v) return false;
	// If the location contains a 5-digit ZIP code, treat CA ZIP ranges as California.
	const zipMatch = v.match(/\b(\d{5})\b/);
	if (zipMatch) {
		const zip = Number(zipMatch[1]);
		// Most California ZIP codes fall between 90001 and 96162.
		if (zip >= 90001 && zip <= 96162) return true;
	}
	const lower = v.toLowerCase();
	if (/\bcalifornia\b/.test(lower)) return true;
	if (/(^|,\s*)ca\b/.test(lower)) return true;
	return false;
}

export async function createSupabaseLead(payload: LeadPayload) {
	const { lead_name, lead_phone, lead_email = null, ref_code = null, journey = null, notes = null } = payload;

	// Start from a shallow copy of the journey (if provided) so we can enrich it safely.
	const baseJourney: Record<string, any> =
		journey && typeof journey === "object" ? { ...journey } : {};

	// Ensure notes are preserved on the journey JSON if provided either at the top level
	// or already present on the journey object.
	if (typeof notes === "string" && notes.trim()) {
		baseJourney.notes = notes.trim();
	} else if (typeof baseJourney.notes === "string" && baseJourney.notes.trim()) {
		baseJourney.notes = baseJourney.notes.trim();
	}

	let finalJourney: Record<string, any> | null = Object.keys(baseJourney).length
		? baseJourney
		: null;

	try {
		const eligibility: EligibilityProfile = buildEligibilityFromInput(baseJourney);
		const location = eligibility.location;
		let region: "ca" | "non_ca" | "unknown" = "unknown";
		if (!location) {
			region = "unknown";
		} else if (isCaliforniaLocation(location)) {
			region = "ca";
		} else {
			region = "non_ca";
		}

		let programResults: {
			region: string;
			matched: MatchResult["matched"];
			maybe: MatchResult["maybe"];
			summary: MatchSummary;
			computed_at: string;
		};

		if (region === "ca") {
			const matchResult: MatchResult = matchPrograms(eligibility, CA_PROGRAMS_STATEWIDE_V0);
			const summary: MatchSummary = buildMatchSummary(matchResult);
			programResults = {
				region,
				matched: matchResult.matched,
				maybe: matchResult.maybe,
				summary,
				computed_at: summary.computed_at,
			};
		} else {
			const headline = "Out-of-state programs available";
			const potential_value_text =
				"A HomeFront Program Specialist will follow up with local options.";
			const computed_at = new Date().toISOString();
			const summary: MatchSummary = {
				matched_count: 0,
				maybe_count: 0,
				headline,
				potential_value_text,
				computed_at,
			};
			programResults = {
				region,
				matched: [],
				maybe: [],
				summary,
				computed_at,
			};
		}

		finalJourney = {
			...baseJourney,
			schema_version: ELIGIBILITY_SCHEMA_VERSION,
			eligibility,
			program_results: programResults,
		};
	} catch (err) {
		console.error("[createSupabaseLead] Failed to compute eligibility/program results", err);
		finalJourney = Object.keys(baseJourney).length ? baseJourney : null;
	}

	const { data, error } = await supabaseAdmin
		.from("Leads")
		.insert([
			{
				NAME: lead_name,
				lead_phone,
				lead_email,
				ref_code,
				journey: finalJourney,
				status: "new",
			},
		])
		.select();

	if (error) {
		return { ok: false as const, error: error.message };
	}

	const leadRow = data && data[0];

	// Best-effort: ensure this person also exists in Referrers as a potential future referrer.
	// This should never block lead creation; failures are logged and ignored.
	if (leadRow) {
		try {
			await ensureReferrer({
				name: lead_name,
				phone: lead_phone,
				email: lead_email,
				kind: "lead",
				refCode: null,
				referredByRefCode: ref_code,
			});
		} catch (e) {
			console.error("Failed to ensure Referrers entry for lead", e);
		}

		// Best-effort: log a marketing_signup event for ambassador/partner tracking
		// when a lead arrives with a ref_code. This is de-duplicated by a hash of
		// phone/email plus the ambassador code so repeated submissions do not
		// generate duplicate marketing payout events.
		try {
			if (ref_code) {
				const contactHash = buildContactHash(lead_phone, lead_email);
				if (contactHash) {
					await supabaseAdmin
						.from("MarketingSignups")
						.upsert(
							{
								contact_hash: contactHash,
								ambassador_code: ref_code,
								lead_id: leadRow.id ?? null,
								source: (finalJourney && typeof finalJourney.source === "string" && finalJourney.source.trim()) || "funnel",
								event_type: "marketing_signup",
							},
							{ onConflict: "contact_hash,ambassador_code" }
						)
						.maybeSingle();
				}
			}
		} catch (e) {
			console.error("Failed to record marketing signup event", e);
		}
	}

	return { ok: true as const, lead: leadRow };
}
