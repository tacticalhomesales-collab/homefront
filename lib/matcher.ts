import { EligibilityProfile, YesNoUnsure, IncomeBand } from "./eligibility";
import { CA_PROGRAMS_STATEWIDE_V0, ProgramRecord } from "./programs/ca_statewide_v0";

export type ProgramMatch = {
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

export type MatchResult = {
  matched: ProgramMatch[];
  maybe: ProgramMatch[];
  excluded: ProgramMatch[];
};

const PROGRAM_PRIORITY: Record<string, number> = {
  wells_dream_plan_home: 200,
  wells_homebuyer_access: 190,
};

function buildBaseMatch(program: ProgramRecord): Omit<ProgramMatch, "why" | "missing_fields"> {
  return {
    program_id: program.program_id,
    name: program.name,
    category: program.category,
    geography: program.geography,
    assistance_max_text: program.assistance_max_text,
    contact_text: program.contact_text,
    official_urls: program.official_urls,
    status: program.status,
  };
}

function computeMissingFields(e: EligibilityProfile, program: ProgramRecord): string[] {
  const missing: string[] = [];
  for (const field of program.required_fields) {
    const value = (e as any)[field];
    if (value === null || value === undefined) {
      missing.push(field as string);
      continue;
    }
    if (typeof value === "string" && !value.trim()) {
      missing.push(field as string);
      continue;
    }
    if (field === "income_band") {
      const band = value as IncomeBand;
      if (band === "prefer_not" || band === "unsure") {
        missing.push(field as string);
        continue;
      }
    }
    if (field === "first_time_buyer") {
      const v = value as YesNoUnsure;
      if (v === "unsure") {
        missing.push(field as string);
        continue;
      }
    }
    if (field === "household_size" && typeof value !== "number") {
      missing.push(field as string);
      continue;
    }
  }
  return missing;
}

function sortMatches(matches: ProgramMatch[]) {
  return matches
    .map((match, index) => ({ match, index }))
    .sort((left, right) => {
      const priorityDiff =
        (PROGRAM_PRIORITY[right.match.program_id] || 0) -
        (PROGRAM_PRIORITY[left.match.program_id] || 0);

      if (priorityDiff !== 0) return priorityDiff;
      return left.index - right.index;
    })
    .map(({ match }) => match);
}

export function matchPrograms(
  e: EligibilityProfile,
  programs: ProgramRecord[] = CA_PROGRAMS_STATEWIDE_V0
): MatchResult {
  const matched: ProgramMatch[] = [];
  const maybe: ProgramMatch[] = [];
  const excluded: ProgramMatch[] = [];

  for (const program of programs) {
    const base = buildBaseMatch(program);
    const missing_fields = computeMissingFields(e, program);

    if (missing_fields.length > 0) {
      maybe.push({
        ...base,
        missing_fields,
        why: [
          "More information is needed to confirm eligibility (missing: " +
            missing_fields.join(", ") +
            ")",
        ],
      });
      continue;
    }

    const failed: string[] = [];
    const passedLabels: string[] = [];

    for (const check of program.checks) {
      try {
        if (check.test(e)) {
          passedLabels.push(check.label);
        } else {
          failed.push(check.fail_reason);
        }
      } catch {
        failed.push(check.fail_reason || "Unable to evaluate one of the program checks.");
      }
    }

    if (failed.length === 0) {
      const why: string[] =
        passedLabels.length > 0
          ? passedLabels.map((label) => "Meets: " + label)
          : [
              "Based on the information provided, this looks like a potential fit. Details depend on full program rules.",
            ];
      matched.push({
        ...base,
        missing_fields: [],
        why,
      });
    } else {
      excluded.push({
        ...base,
        missing_fields: [],
        why: failed,
      });
    }
  }

  return {
    matched: sortMatches(matched),
    maybe: sortMatches(maybe),
    excluded,
  };
}
