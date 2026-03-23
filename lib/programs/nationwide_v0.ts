import { ProgramRecord } from "./ca_statewide_v0";

const HERO_PUBLIC_SERVICE = ["teacher", "law_enforcement", "firefighter_emt"];

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
  {
    program_id: "usda_guaranteed_loan_path",
    name: "USDA Rural Development Guaranteed Loan Path",
    mvp_tier: "tier_2",
    category: "federal_product",
    geography: "United States (USDA-eligible rural areas)",
    assistance_max_text:
      "USDA-backed home loan option with low down payment requirements for eligible primary-residence buyers in qualifying rural areas.",
    official_urls: [
      "https://www.rd.usda.gov/programs-services/single-family-housing-programs/single-family-housing-guaranteed-loan-program",
    ],
    last_verified: "2026-03-23T00:00:00.000Z",
    status: "open",
    required_fields: ["occupancy"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "USDA home loans are generally intended for owner-occupied primary residences.",
      },
      {
        label: "Potential USDA rural-area fit",
        test: () => true,
        fail_reason:
          "USDA eligibility depends on rural-property and household-income rules checked through USDA tools and approved lenders.",
      },
    ],
  },
  {
    program_id: "usda_direct_loan_path",
    name: "USDA Single Family Housing Direct Home Loans",
    mvp_tier: "tier_2",
    category: "federal_product",
    geography: "United States (USDA-eligible rural areas)",
    assistance_max_text:
      "Direct USDA home loan path for low- and very-low-income borrowers in eligible rural areas, with payment assistance for qualifying households.",
    official_urls: [
      "https://www.rd.usda.gov/programs-services/single-family-housing-programs/single-family-housing-direct-home-loans",
      "https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do?pageAction=assessmentType",
    ],
    last_verified: "2026-03-23T00:00:00.000Z",
    status: "open",
    required_fields: ["occupancy", "income_band"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "USDA direct home loans are generally intended for owner-occupied primary residences.",
      },
      {
        label: "Low-income buyer profile",
        test: (e) => e.income_band === "lt_80k",
        fail_reason:
          "USDA direct loans are generally targeted to low- and very-low-income applicants, with final eligibility based on local limits and rural property rules.",
      },
    ],
  },
  {
    program_id: "hud_gnnd_national",
    name: "HUD Good Neighbor Next Door (GNND)",
    mvp_tier: "tier_2",
    category: "federal_inventory_program",
    geography: "United States (selected HUD revitalization areas)",
    assistance_max_text:
      "Eligible teachers, law enforcement officers, firefighters, and EMTs can receive a 50% discount on certain HUD-owned homes; availability depends on inventory.",
    official_urls: ["https://www.hud.gov/program_offices/housing/sfh/reo/goodn/gnndabot"],
    last_verified: "2026-03-23T00:00:00.000Z",
    status: "unknown",
    required_fields: ["hero_type", "occupancy"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "GNND homes must generally be used as the buyer's primary residence.",
      },
      {
        label: "Eligible public-service profession",
        test: (e) => (e.hero_type ? HERO_PUBLIC_SERVICE.includes(e.hero_type) : false),
        fail_reason:
          "GNND is limited to eligible teachers, law enforcement officers, firefighters, and EMTs.",
      },
    ],
  },
  {
    program_id: "chenoa_fund_dpa",
    name: "Chenoa Fund Down Payment Assistance",
    mvp_tier: "tier_1",
    category: "national_down_payment_assistance",
    geography: "United States (except New York, participating lenders)",
    assistance_max_text:
      "Down payment assistance through participating lenders with forgivable and repayable second-mortgage options, commonly paired with FHA financing.",
    official_urls: ["https://chenoafund.org/"],
    last_verified: "2026-03-23T00:00:00.000Z",
    status: "open",
    required_fields: ["occupancy"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Chenoa Fund assistance is generally intended for owner-occupied primary residences.",
      },
      {
        label: "Compatible with low-down-payment loan paths",
        test: (e) => e.loan_type_intent == null || e.loan_type_intent === "fha" || e.loan_type_intent === "usda",
        fail_reason:
          "This assistance is typically paired with compatible low-down-payment loan products through participating lenders.",
      },
    ],
  },
  {
    program_id: "national_homebuyers_fund_dpa",
    name: "National Homebuyers Fund Down Payment Assistance",
    mvp_tier: "tier_1",
    category: "national_down_payment_assistance",
    geography: "United States (participating lenders)",
    assistance_max_text:
      "Down payment and closing-cost assistance available through participating lenders and compatible mortgage products.",
    official_urls: ["https://www.nhfloan.org/"],
    last_verified: "2026-03-23T00:00:00.000Z",
    status: "open",
    required_fields: ["occupancy"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "NHF assistance is generally intended for owner-occupied primary residences.",
      },
      {
        label: "Mortgage-financing path",
        test: (e) => e.loan_type_intent == null || e.loan_type_intent !== "cash",
        fail_reason:
          "NHF assistance is designed to pair with eligible mortgage financing rather than cash purchases.",
      },
    ],
  },
  {
    program_id: "fannie_mae_homeready",
    name: "Fannie Mae HomeReady Mortgage",
    mvp_tier: "tier_2",
    category: "agency_affordable_mortgage",
    geography: "United States",
    assistance_max_text:
      "Affordable conventional mortgage path with as little as 3% down, flexible funding sources, and support for low-income borrowers.",
    official_urls: [
      "https://singlefamily.fanniemae.com/originating-underwriting/mortgage-products/homeready-mortgage",
    ],
    last_verified: "2026-03-23T00:00:00.000Z",
    status: "open",
    required_fields: ["occupancy", "income_band"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "HomeReady is generally intended for owner-occupied primary residences.",
      },
      {
        label: "Affordable-lending income profile",
        test: (e) => e.income_band === "lt_80k" || e.income_band === "80_120k",
        fail_reason:
          "HomeReady targets low-income borrowers, with final eligibility typically based on local AMI rules and lender underwriting.",
      },
      {
        label: "Conventional-style or open mortgage path",
        test: (e) =>
          e.loan_type_intent == null ||
          e.loan_type_intent === "conv" ||
          e.loan_type_intent === "conventional_fixed",
        fail_reason:
          "HomeReady is a conventional mortgage path and is most relevant for borrowers exploring conventional financing.",
      },
    ],
  },
  {
    program_id: "freddie_mac_home_possible",
    name: "Freddie Mac Home Possible",
    mvp_tier: "tier_2",
    category: "agency_affordable_mortgage",
    geography: "United States",
    assistance_max_text:
      "Low-down-payment conventional mortgage path for low- and very-low-income borrowers with flexible funding sources.",
    official_urls: [
      "https://sf.freddiemac.com/working-with-us/origination-underwriting/mortgage-products/home-possible",
    ],
    last_verified: "2026-03-23T00:00:00.000Z",
    status: "open",
    required_fields: ["occupancy", "income_band"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Home Possible is generally intended for owner-occupied primary residences.",
      },
      {
        label: "Affordable-lending income profile",
        test: (e) => e.income_band === "lt_80k" || e.income_band === "80_120k",
        fail_reason:
          "Home Possible targets low- and very-low-income borrowers, with final eligibility generally based on local AMI rules.",
      },
      {
        label: "Conventional-style or open mortgage path",
        test: (e) =>
          e.loan_type_intent == null ||
          e.loan_type_intent === "conv" ||
          e.loan_type_intent === "conventional_fixed",
        fail_reason:
          "Home Possible is a conventional mortgage path and is most relevant for borrowers exploring conventional financing.",
      },
    ],
  },
  {
    program_id: "chase_homebuyer_grant",
    name: "Chase Homebuyer Grant",
    mvp_tier: "tier_2",
    category: "lender_grant",
    geography: "Select areas across the United States (Chase)",
    assistance_max_text:
      "$2,500 or $5,000 grant that can reduce rate, lender fees, or eligible purchase costs for qualifying primary-residence buyers in select areas.",
    official_urls: ["https://www.chase.com/personal/mortgage/affordablelending"],
    last_verified: "2026-03-23T00:00:00.000Z",
    status: "unknown",
    required_fields: ["occupancy"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "The Chase Homebuyer Grant is generally limited to primary-residence purchases.",
      },
    ],
  },
  {
    program_id: "chase_dreamaker_mortgage",
    name: "Chase DreaMaker Mortgage",
    mvp_tier: "tier_3",
    category: "lender_affordable_mortgage",
    geography: "United States (Chase, eligible borrowers and areas)",
    assistance_max_text:
      "3% down mortgage option with flexible credit guidelines and income limits for eligible primary-residence buyers.",
    official_urls: ["https://www.chase.com/personal/mortgage/affordablelending"],
    last_verified: "2026-03-23T00:00:00.000Z",
    status: "unknown",
    required_fields: ["occupancy", "income_band"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "DreaMaker is generally intended for primary-residence home purchases.",
      },
      {
        label: "Affordable-lending income profile",
        test: (e) => e.income_band === "lt_80k" || e.income_band === "80_120k",
        fail_reason:
          "DreaMaker uses income limits and borrower-specific underwriting, so it is most relevant for lower-income affordable-lending scenarios.",
      },
    ],
  },
];
