export const ELIGIBILITY_SCHEMA_VERSION = 1 as const;

export type YesNoUnsure = "yes" | "no" | "unsure";
export type OccupancyType = "primary" | "second_home" | "investment" | "unsure";
export type LoanTypeIntent =
  | "va"
  | "fha"
  | "conv"
  | "usda"
  | "calhfa"
  | "conventional_fixed"
  | "cash"
  | "other"
  | "unsure";
export type CreditBand =
  | "great"
  | "good"
  | "fair"
  | "needs_work"
  | "prefer_not"
  | "unsure";
export type HeroType =
  | "military"
  | "veteran"
  | "active_duty"
  | "law_enforcement"
  | "firefighter_emt"
  | "teacher"
  | "nurse_healthcare"
  | "civilian"
  | "unsure";
export type IncomeBand =
  | "lt_80k"
  | "80_120k"
  | "120_160k"
  | "160_200k"
  | "200_plus"
  | "prefer_not"
  | "unsure";

export type IncomeAmiBand = "<=80" | "81-120" | ">120" | "unknown";

export type EligibilityProfile = {
  // New optional keys added only via /programs-check
  zip: string | null;
  city_limit_confirmed: YesNoUnsure | null;
  first_time_buyer: YesNoUnsure | null;
  occupancy: OccupancyType | null;
  household_size: number | null;
  income_band: IncomeBand | null;
  income_ami_band: IncomeAmiBand | null;

  // Derived from existing journey params
  mission: string | null;
  location: string | null;
  financing: string | null;
  loan_type_intent: LoanTypeIntent | null;
  credit_band: CreditBand | null;
  budget_range: string | null;
  timeline: string | null;

  // Derived hero identity (conservative)
  hero_type: HeroType | null;
  branch: string | null;
  role: string | null;
  service_track: string | null;
  audience: string | null;
  service_status: string | null;
};

function isUrlSearchParams(value: any): value is URLSearchParams {
  return typeof URLSearchParams !== "undefined" && value instanceof URLSearchParams;
}

function getRaw(input: URLSearchParams | Record<string, any>, key: string): any {
  if (isUrlSearchParams(input)) {
    const v = input.get(key);
    return v === null ? undefined : v;
  }
  return (input as Record<string, any>)[key];
}

function normalizeString(value: any): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function parseNumber(value: any): number | null {
  if (value == null) return null;
  const str = typeof value === "string" ? value : String(value);
  const n = Number(str.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function normalizeYesNoUnsure(raw: any): YesNoUnsure | null {
  if (raw == null) return null;
  const str = String(raw).trim().toLowerCase();
  if (!str) return null;
  if (["1", "true", "yes", "y"].includes(str)) return "yes";
  if (["0", "false", "no", "n"].includes(str)) return "no";
  return "unsure";
}

function mapLoanTypeIntent(raw: any): LoanTypeIntent | null {
  const v = normalizeString(raw);
  if (!v) return null;
  const s = v.toLowerCase();
  if (s.includes("cash")) return "cash";
  if (s.includes("fixed") && (s.includes("conv") || s.includes("conventional"))) {
    return "conventional_fixed";
  }
  if (s.includes("conventional") || s.includes("conv")) return "conv";
  if (s.includes("va")) return "va";
  if (s.includes("fha")) return "fha";
  if (s.includes("usda")) return "usda";
  if (s.includes("calhfa")) return "calhfa";
  if (s.includes("other")) return "other";
  return "unsure";
}

function mapCreditBand(raw: any): CreditBand | null {
  const v = normalizeString(raw);
  if (!v) return null;
  const s = v.toLowerCase();
  if (s === "great") return "great";
  if (s === "good") return "good";
  if (s === "fair") return "fair";
  if (s === "needs_work") return "needs_work";
  if (s === "prefer_not") return "prefer_not";
  if (s === "unsure") return "unsure";
  return "unsure";
}

function mapIncomeBand(raw: any): IncomeBand | null {
  const v = normalizeString(raw);
  if (!v) return null;
  const s = v.toLowerCase();
  if (s === "lt_80k") return "lt_80k";
  if (s === "80_120k") return "80_120k";
  if (s === "120_160k") return "120_160k";
  if (s === "160_200k") return "160_200k";
  if (s === "200_plus") return "200_plus";
  if (s === "prefer_not") return "prefer_not";
  if (s === "unsure") return "unsure";
  return "unsure";
}

function mapIncomeAmiBand(raw: any): IncomeAmiBand | null {
  const v = normalizeString(raw);
  if (!v) return null;
  const s = v.toLowerCase();
  if (s === "<=80" || s === "lt_80" || s === "0-80") return "<=80";
  if (s === "81-120" || s === "80_120" || s === "81_120") return "81-120";
  if (s === ">120" || s === "gt_120" || s === "120_plus") return ">120";
  if (s === "unknown" || s === "unsure" || s === "prefer_not") return "unknown";
  return "unknown";
}

function inferHeroType(
  serviceTrack: string | null,
  audience: string | null,
  serviceStatus: string | null,
  role: string | null
): HeroType | null {
  const st = serviceTrack?.toLowerCase() || "";
  const aud = audience?.toLowerCase() || "";
  const ss = serviceStatus?.toLowerCase() || "";
  const r = role?.toLowerCase() || "";

  if (st === "military") {
    if (ss.includes("active")) return "active_duty";
    return "military";
  }

  if (aud.includes("veteran") || ss.includes("veteran") || ss.includes("retired") || ss.includes("separated")) {
    return "veteran";
  }

  if (st === "fr") {
    if (r.includes("police") || r.includes("law")) return "law_enforcement";
    if (r.includes("fire") || r.includes("emt") || r.includes("paramedic")) return "firefighter_emt";
  }

  if (r.includes("teacher")) return "teacher";

  // If we have some audience but nothing matched, conservatively mark as unsure
  if (aud || ss || r || st) return "unsure";

  return null;
}

export function buildEligibilityFromInput(
  input: URLSearchParams | Record<string, any>
): EligibilityProfile {
  // New optional keys provided only via /programs-check
  const zip = normalizeString(getRaw(input, "zip"));
  const city_limit_confirmed = normalizeYesNoUnsure(getRaw(input, "city_limit_confirmed"));
  const first_time_buyer = normalizeYesNoUnsure(getRaw(input, "first_time_buyer"));

  const occupancyRaw = normalizeString(getRaw(input, "occupancy"));
  let occupancy: OccupancyType | null = null;
  if (occupancyRaw) {
    const o = occupancyRaw.toLowerCase();
    if (o === "primary") occupancy = "primary";
    else if (o === "second_home") occupancy = "second_home";
    else if (o === "investment") occupancy = "investment";
    else occupancy = "unsure";
  }

  const household_size = parseNumber(getRaw(input, "household_size"));
  const income_band = mapIncomeBand(getRaw(input, "income_band"));
  const income_ami_band = mapIncomeAmiBand(getRaw(input, "income_ami_band"));

  // Existing journey params
  const mission = normalizeString(getRaw(input, "mission"));
  const location = normalizeString(getRaw(input, "location"));
  const financing = normalizeString(getRaw(input, "financing"));
  const budget_range = normalizeString(getRaw(input, "budget_range"));
  const timeline = normalizeString(getRaw(input, "timeline"));

  const audience = normalizeString(getRaw(input, "audience"));
  const branch = normalizeString(getRaw(input, "branch"));
  const role = normalizeString(getRaw(input, "role"));
  const service_track = normalizeString(getRaw(input, "service_track"));
  const service_status = normalizeString(getRaw(input, "service_status"));

  const loan_type_intent = mapLoanTypeIntent(getRaw(input, "loan_type"));
  const credit_band = mapCreditBand(getRaw(input, "credit_band"));

  const hero_type = inferHeroType(service_track, audience, service_status, role);

  return {
    zip,
    city_limit_confirmed,
    first_time_buyer,
    occupancy,
    household_size,
    income_band,
    income_ami_band,
    mission,
    location,
    financing,
    loan_type_intent,
    credit_band,
    budget_range,
    timeline,
    hero_type,
    branch,
    role,
    service_track,
    audience,
    service_status,
  };
}

