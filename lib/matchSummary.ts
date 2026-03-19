import { MatchResult } from "./matcher";

export type MatchSummary = {
  matched_count: number;
  maybe_count: number;
  headline: string;
  potential_value_text: string;
  computed_at: string;
};

export function buildMatchSummary(result: MatchResult): MatchSummary {
  const matched_count = result.matched.length;
  const maybe_count = result.maybe.length;

  let headline = "No clear program matches yet";
  if (matched_count > 0 && maybe_count > 0) {
    headline = `You may qualify for ${matched_count} program${
      matched_count === 1 ? "" : "s"
    } (and ${maybe_count} more with a few optional details).`;
  } else if (matched_count > 0) {
    headline = `You may qualify for ${matched_count} program${
      matched_count === 1 ? "" : "s"
    }.`;
  } else if (maybe_count > 0) {
    headline = `You may qualify for ${maybe_count} program${
      maybe_count === 1 ? "" : "s"
    } once more details are confirmed.`;
  }

  const potential_value_text =
    "Assistance varies by program; some are % of price or inventory-based.";

  const computed_at = new Date().toISOString();

  return {
    matched_count,
    maybe_count,
    headline,
    potential_value_text,
    computed_at,
  };
}

