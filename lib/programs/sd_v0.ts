import { EligibilityProfile } from "../eligibility";

export type ProgramRecord = {
  program_id: string;
  name: string;
  mvp_tier: "tier_1" | "tier_2" | "tier_3";
  category: string;
  geography: string;
  assistance_max_text: string;
  official_urls: string[];
  last_verified: string; // ISO date string
  status: "open" | "closed" | "unknown";
  required_fields: (keyof EligibilityProfile)[];
  checks: {
    label: string;
    test: (e: EligibilityProfile) => boolean;
    fail_reason: string;
  }[];
};

export const SD_PROGRAMS_V0: ProgramRecord[] = [
  {
    program_id: "sdhc_low_income_fthb",
    name: "SDHC Low-Income First-Time Homebuyer (City of San Diego)",
    mvp_tier: "tier_1",
    category: "down_payment_assistance",
    geography: "City of San Diego",
    assistance_max_text: "Up to local program limits for down payment/closing costs.",
    official_urls: [
      "https://www.sdhc.org/", // informational only, not scraped at runtime
    ],
    last_verified: "2025-01-01T00:00:00.000Z",
    status: "open",
    required_fields: [
      "city_limit_confirmed",
      "first_time_buyer",
      "occupancy",
      "income_band",
    ],
    checks: [
      {
        label: "Home is within San Diego city limits",
        test: (e) => e.city_limit_confirmed === "yes",
        fail_reason: "Property not confirmed inside San Diego city limits.",
      },
      {
        label: "First-time or comparable homebuyer",
        test: (e) => e.first_time_buyer !== "no",
        fail_reason: "Program typically limited to first-time buyers.",
      },
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program usually requires the home to be a primary residence.",
      },
      {
        label: "Reported income band provided",
        test: (e) =>
          !!e.income_band &&
          e.income_band !== "prefer_not" &&
          e.income_band !== "unsure",
        fail_reason:
          "Program is income-based; income band needs to be provided to confirm eligibility.",
      },
    ],
  },
  {
    program_id: "sdhc_middle_income_fthb",
    name: "SDHC Middle-Income First-Time Homebuyer (City of San Diego)",
    mvp_tier: "tier_1",
    category: "down_payment_assistance",
    geography: "City of San Diego",
    assistance_max_text:
      "Down payment assistance for eligible middle-income buyers (amount varies).",
    official_urls: ["https://www.sdhc.org/"],
    last_verified: "2025-01-01T00:00:00.000Z",
    status: "open",
    required_fields: ["city_limit_confirmed", "first_time_buyer", "occupancy"],
    checks: [
      {
        label: "Home is within San Diego city limits",
        test: (e) => e.city_limit_confirmed === "yes",
        fail_reason: "Program is limited to homes inside San Diego city limits.",
      },
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program usually requires the home to be a primary residence.",
      },
    ],
  },
  {
    program_id: "county_sd_dpa",
    name: "County of San Diego Down Payment Assistance",
    mvp_tier: "tier_2",
    category: "down_payment_assistance",
    geography: "County of San Diego (select areas)",
    assistance_max_text:
      "County-level down payment assistance; maximum amounts depend on program details.",
    official_urls: ["https://www.sandiegocounty.gov/"],
    last_verified: "2025-01-01T00:00:00.000Z",
    status: "open",
    required_fields: ["first_time_buyer", "occupancy", "income_band"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program generally applies only to primary residences.",
      },
    ],
  },
  {
    program_id: "calhfa_myhome",
    name: "CalHFA MyHome Assistance Program",
    mvp_tier: "tier_2",
    category: "statewide_down_payment_assistance",
    geography: "California",
    assistance_max_text:
      "Statewide CalHFA assistance; amounts and eligibility vary by program rules.",
    official_urls: ["https://www.calhfa.ca.gov/"],
    last_verified: "2025-01-01T00:00:00.000Z",
    status: "open",
    required_fields: ["occupancy"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program is generally for owner-occupied homes.",
      },
    ],
  },
  {
    program_id: "hope_teacher",
    name: "HOPE Teacher Homeownership Support (Local)",
    mvp_tier: "tier_3",
    category: "teacher_benefit",
    geography: "San Diego region (select partners)",
    assistance_max_text:
      "Local support program for eligible teachers; benefits vary by partner.",
    official_urls: [],
    last_verified: "2025-01-01T00:00:00.000Z",
    status: "open",
    required_fields: ["hero_type"],
    checks: [
      {
        label: "Teacher or education professional",
        test: (e) => e.hero_type === "teacher",
        fail_reason: "Program appears limited to eligible teachers.",
      },
    ],
  },
  {
    program_id: "hud_gnnd",
    name: "HUD Good Neighbor Next Door (GNND)",
    mvp_tier: "tier_3",
    category: "federal_inventory_program",
    geography: "Selected HUD inventory areas",
    assistance_max_text:
      "Significant discounts on specific HUD-owned properties; availability is inventory-based.",
    official_urls: ["https://www.hud.gov/"],
    last_verified: "2025-01-01T00:00:00.000Z",
    status: "unknown", // inventory- and listing-based
    required_fields: ["hero_type", "occupancy"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program generally requires you to live in the home.",
      },
      {
        label: "Eligible public service profession",
        test: (e) =>
          e.hero_type === "teacher" ||
          e.hero_type === "law_enforcement" ||
          e.hero_type === "firefighter_emt",
        fail_reason:
          "Program is limited to certain public service roles (e.g., teachers, law enforcement, firefighters/EMTs).",
      },
    ],
  },
];

export type { ProgramRecord as Program };
