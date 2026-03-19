import { strict as assert } from "node:assert";
import type { HousingProgram } from "../types";
import { searchHousingPrograms } from "../matcher";

// Small inline fixture set for unit tests.
const FIXTURE_PROGRAMS: HousingProgram[] = [
  {
    program_id: "statewide_ca_dpa",
    name: "CA Statewide DPA",
    level: "state",
    state: "CA",
    geography: "California (statewide)",
    geography_type: "statewide",
    applies_to_states: ["CA"],
    applies_to_counties: [],
    applies_to_cities: [],
    applies_to_zip_codes: [],
    coverage_notes: "",
    category: "state_down_payment_assistance",
    assistance_summary: "Statewide down payment help.",
    target_audience: "first_time_buyers",
    income_focus: "low_income",
    official_urls: ["https://example.com/ca"],
    status: "open",
    last_reviewed: "2026-01-01",
    eligibility_notes: "- First-time buyers only",
  },
  {
    program_id: "city_sf_dpa",
    name: "San Francisco DPA",
    level: "city",
    state: "CA",
    geography: "City and County of San Francisco",
    geography_type: "single_city",
    applies_to_states: ["CA"],
    applies_to_counties: ["San Francisco County, CA"],
    applies_to_cities: ["San Francisco, CA"],
    applies_to_zip_codes: ["94102"],
    coverage_notes: "",
    category: "local_down_payment_assistance",
    assistance_summary: "SF-specific assistance.",
    target_audience: "first_time_buyers",
    income_focus: "moderate_income",
    official_urls: ["https://example.com/sf"],
    status: "open",
    last_reviewed: "2026-01-01",
    eligibility_notes: "- SF only",
  },
  {
    program_id: "county_la_dpa",
    name: "LA County DPA",
    level: "county",
    state: "CA",
    geography: "Los Angeles County",
    geography_type: "single_county",
    applies_to_states: ["CA"],
    applies_to_counties: ["Los Angeles County, CA"],
    applies_to_cities: [],
    applies_to_zip_codes: [],
    coverage_notes: "",
    category: "local_down_payment_assistance",
    assistance_summary: "LA County assistance.",
    target_audience: "first_time_buyers",
    income_focus: "broad",
    official_urls: ["https://example.com/la"],
    status: "open",
    last_reviewed: "2026-01-01",
    eligibility_notes: "- LA County only",
  },
  {
    program_id: "usda_zip_based",
    name: "USDA Rural Home Loan",
    level: "federal",
    state: "US",
    geography: "USDA-eligible rural areas",
    geography_type: "zip_based",
    applies_to_states: ["CA"],
    applies_to_counties: [],
    applies_to_cities: [],
    applies_to_zip_codes: [],
    coverage_notes: "USDA lookup required by property.",
    category: "federal_product",
    assistance_summary: "USDA-backed mortgage path.",
    target_audience: "general_homebuyers",
    income_focus: "moderate_income",
    official_urls: ["https://example.com/usda"],
    status: "open",
    last_reviewed: "2026-01-01",
    eligibility_notes: "- Property-level USDA eligibility",
  },
  {
    program_id: "closed_program",
    name: "Closed Program",
    level: "state",
    state: "CA",
    geography: "California",
    geography_type: "statewide",
    applies_to_states: ["CA"],
    applies_to_counties: [],
    applies_to_cities: [],
    applies_to_zip_codes: [],
    coverage_notes: "",
    category: "state_down_payment_assistance",
    assistance_summary: "No longer active.",
    target_audience: "first_time_buyers",
    income_focus: "unknown",
    official_urls: ["https://example.com/closed"],
    status: "closed",
    last_reviewed: "2025-01-01",
    eligibility_notes: "",
  },
];

// Monkey-patch the loader so matcher uses our fixtures.
jest.mock("../loadPrograms", () => ({
  loadAllHousingPrograms: async () => FIXTURE_PROGRAMS,
}));

describe("searchHousingPrograms matcher", () => {
  test("statewide match", async () => {
    const result = await searchHousingPrograms({ state: "CA" });
    const ids = result.matchedPrograms.map((m) => m.program.program_id);
    assert(ids.includes("statewide_ca_dpa"));
  });

  test("city match", async () => {
    const result = await searchHousingPrograms({ city: "San Francisco", state: "CA" });
    const ids = result.matchedPrograms.map((m) => m.program.program_id);
    assert(ids.includes("city_sf_dpa"));
  });

  test("county match", async () => {
    const result = await searchHousingPrograms({ county: "Los Angeles County", state: "CA" });
    const ids = result.matchedPrograms.map((m) => m.program.program_id);
    assert(ids.includes("county_la_dpa"));
  });

  test("zip explicit match", async () => {
    const result = await searchHousingPrograms({ zip: "94102" });
    const ids = result.matchedPrograms.map((m) => m.program.program_id);
    assert(ids.includes("city_sf_dpa"));
  });

  test("USDA/federal zip_based behavior marks requiresPropertyEligibilityLookup", async () => {
    const result = await searchHousingPrograms({ state: "CA" });
    const usda = result.matchedPrograms.find(
      (m) => m.program.program_id === "usda_zip_based",
    );
    assert(usda);
    assert(usda.requiresPropertyEligibilityLookup === true);
  });

  test("closed programs are excluded by default", async () => {
    const result = await searchHousingPrograms({ state: "CA" });
    const ids = result.matchedPrograms.map((m) => m.program.program_id);
    assert(!ids.includes("closed_program"));
  });
});
