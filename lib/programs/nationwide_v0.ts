import { ProgramRecord } from "./ca_statewide_v0";

export const NATIONWIDE_PROGRAMS_V0: ProgramRecord[] = [
  {
    program_id: "va_home_loan_path",
    name: "VA Home Loan Path",
    mvp_tier: "tier_3",
    category: "federal_product",
    geography: "United States (eligible veterans and service members)",
    assistance_max_text:
      "VA-backed loan option (not a grant); benefits vary by borrower profile.",
    official_urls: ["https://www.va.gov/housing-assistance/home-loans/"],
    last_verified: "2025-01-01T00:00:00.000Z",
    status: "open",
    required_fields: [],
    checks: [
      {
        label: "Military or veteran service",
        test: (e) =>
          e.service_track === "military" &&
          (e.hero_type ? ["military", "veteran", "active_duty"].includes(e.hero_type) : false),
        fail_reason:
          "VA loans are generally limited to eligible veterans, service members, and some surviving spouses.",
      },
    ],
  },
  {
    program_id: "fha_home_loan_path",
    name: "FHA Home Loan Path",
    mvp_tier: "tier_3",
    category: "federal_product",
    geography: "United States",
    assistance_max_text:
      "FHA-insured loan option (not a grant); lower down payment requirements for eligible borrowers.",
    official_urls: ["https://www.hud.gov/program_offices/housing/fhahistory"],
    last_verified: "2025-01-01T00:00:00.000Z",
    status: "open",
    required_fields: [],
    checks: [
      {
        label: "Exploring FHA-style options",
        test: () => true,
        fail_reason:
          "FHA eligibility depends on full underwriting; this is shown as a potential loan path only.",
      },
    ],
  },
];
