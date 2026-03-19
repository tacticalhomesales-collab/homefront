import { EligibilityProfile, HeroType } from "../eligibility";

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

const HERO_MILITARY: HeroType[] = ["military", "veteran", "active_duty"];
const HERO_GNND: HeroType[] = ["teacher", "law_enforcement", "firefighter_emt"];

export const CA_PROGRAMS_STATEWIDE_V0: ProgramRecord[] = [
  {
    program_id: "calhfa_myhome",
    name: "CalHFA MyHome Assistance Program",
    mvp_tier: "tier_1",
    category: "state_down_payment_assistance",
    geography: "California (statewide)",
    assistance_max_text:
      "Statewide CalHFA assistance; amounts and eligibility vary by program rules.",
    official_urls: ["https://www.calhfa.ca.gov/"],
    last_verified: "2025-01-01T00:00:00.000Z",
    status: "open",
    required_fields: [
      "occupancy",
      "first_time_buyer",
      "household_size",
      "income_band",
    ],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program is generally for owner-occupied primary residences.",
      },
      {
        label: "First-time or similar homebuyer",
        test: (e) => e.first_time_buyer !== "no",
        fail_reason: "Program is typically limited to first-time (or similar) buyers.",
      },
    ],
  },
  {
    program_id: "gsfa_platinum",
    name: "GSFA Platinum Program",
    mvp_tier: "tier_1",
    category: "state_down_payment_assistance",
    geography: "California (select lenders)",
    assistance_max_text:
      "Down payment and closing cost assistance; limits vary by income and loan type.",
    official_urls: ["https://www.gsfahome.org/"],
    last_verified: "2025-01-01T00:00:00.000Z",
    status: "open",
    required_fields: ["occupancy", "household_size", "income_band"],
    checks: [
      {
        label: "Owner-occupied home",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program is generally for owner-occupied homes.",
      },
    ],
  },
  {
    program_id: "calvet_home_loan",
    name: "CalVet Home Loans",
    mvp_tier: "tier_2",
    category: "veteran_home_loan",
    geography: "California (eligible veterans)",
    assistance_max_text:
      "State-backed home loan options for eligible veterans and service members (not a grant).",
    official_urls: ["https://www.calvet.ca.gov/"],
    last_verified: "2025-01-01T00:00:00.000Z",
    status: "open",
    required_fields: [],
    checks: [
      {
        label: "Military or veteran service",
        test: (e) =>
          e.service_track === "military" &&
          (e.hero_type ? HERO_MILITARY.includes(e.hero_type) : false),
        fail_reason:
          "Program appears limited to eligible veterans or military service members.",
      },
    ],
  },
  {
    program_id: "hud_gnnd",
    name: "HUD Good Neighbor Next Door (GNND)",
    mvp_tier: "tier_2",
    category: "federal_inventory_program",
    geography: "Selected HUD inventory areas in California",
    assistance_max_text:
      "Significant discounts on specific HUD-owned properties; availability is inventory-based.",
    official_urls: ["https://www.hud.gov/"],
    last_verified: "2025-01-01T00:00:00.000Z",
    status: "unknown",
    required_fields: ["hero_type", "occupancy"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program generally requires you to live in the home.",
      },
      {
        label: "Eligible public service profession",
        test: (e) => (e.hero_type ? HERO_GNND.includes(e.hero_type) : false),
        fail_reason:
          "Program is limited to certain public service roles (teachers, law enforcement, firefighters/EMTs).",
      },
    ],
  },
  {
    program_id: "va_home_loan_path",
    name: "VA Home Loan Path",
    mvp_tier: "tier_3",
    category: "federal_product",
    geography: "California (eligible veterans and service members)",
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
          (e.hero_type ? HERO_MILITARY.includes(e.hero_type) : false),
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
    geography: "California",
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
    program_id: "wells_homebuyer_access",
    name: "Wells Fargo Homebuyer Access (CA)",
    mvp_tier: "tier_1",
    category: "lender_down_payment_assistance",
    geography: "California (select markets, Wells Fargo)",
    assistance_max_text:
      "Wells Fargo lender-paid assistance toward down payment/closing costs; amounts and availability vary by income, location, and lender rules.",
    official_urls: ["https://www.wellsfargo.com/mortgage"],
    last_verified: "2026-02-14T00:00:00.000Z",
    status: "open",
    required_fields: [
      "occupancy",
      "first_time_buyer",
      "income_ami_band",
      "loan_type_intent",
    ],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program is generally for owner-occupied primary residences.",
      },
      {
        label: "First-time or similar homebuyer",
        test: (e) => e.first_time_buyer !== "no",
        fail_reason: "Program is typically limited to first-time (or similar) homebuyers.",
      },
      {
        label: "Low- or moderate-income (AMI-based)",
        test: (e) => e.income_ami_band === "<=80" || e.income_ami_band === "81-120",
        fail_reason:
          "Program is generally targeted to low- and moderate-income buyers (typically up to ~120% area median income).",
      },
      {
        label: "Using a compatible loan type",
        test: (e) =>
          e.loan_type_intent === "conventional_fixed" ||
          e.loan_type_intent === "conv" ||
          e.loan_type_intent === "fha",
        fail_reason:
          "Program is usually paired with certain fixed-rate conventional or FHA-style loans.",
      },
    ],
  },
  {
    program_id: "wells_dream_plan_home",
    name: "Wells Fargo Dream Plan Home (CA)",
    mvp_tier: "tier_2",
    category: "lender_special_program",
    geography: "California (select markets, Wells Fargo)",
    assistance_max_text:
      "Specialized Wells Fargo homeownership support; benefits and eligibility depend on full lender review.",
    official_urls: ["https://www.wellsfargo.com/mortgage"],
    last_verified: "2026-02-14T00:00:00.000Z",
    status: "open",
    required_fields: ["occupancy", "first_time_buyer"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program appears focused on homes you plan to live in.",
      },
      {
        label: "Buying your first (or similar) home",
        test: (e) => e.first_time_buyer !== "no",
        fail_reason:
          "Program is typically positioned for first-time buyers or similar first-home situations.",
      },
    ],
  },
  {
    program_id: "calhfa_dream_for_all",
    name: "CalHFA Dream For All (Shared Appreciation Loan)",
    mvp_tier: "tier_1",
    category: "state_down_payment_assistance",
    geography: "California (statewide, CalHFA)",
    assistance_max_text:
      "Shared-appreciation junior loan that helps cover down payment in exchange for a share of future home price appreciation.",
    official_urls: ["https://www.calhfa.ca.gov/dream/"],
    last_verified: "2026-02-15T00:00:00.000Z",
    status: "open",
    required_fields: ["occupancy", "first_time_buyer"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program is generally for owner-occupied primary residences.",
      },
      {
        label: "First-time homebuyer focus",
        test: (e) => e.first_time_buyer !== "no",
        fail_reason: "Program is typically limited to first-time buyers under CalHFA rules.",
      },
    ],
  },
  {
    program_id: "calhfa_zip_zero_interest_program",
    name: "CalHFA ZIP (Zero Interest Program)",
    mvp_tier: "tier_1",
    category: "state_closing_cost_assistance",
    geography: "California (statewide, CalHFA first-mortgage borrowers)",
    assistance_max_text:
      "Zero-interest, deferred junior loan to help with closing costs/down payment when paired with eligible CalHFA first mortgages.",
    official_urls: ["https://www.calhfa.ca.gov/homeownership/materials/files/calplus.pdf"],
    last_verified: "2026-02-15T00:00:00.000Z",
    status: "open",
    required_fields: ["occupancy", "loan_type_intent"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program is generally for owner-occupied primary residences.",
      },
      {
        label: "Using a CalHFA-style loan path",
        test: (e) => e.loan_type_intent === "calhfa",
        fail_reason: "Program typically pairs with specific CalHFA first mortgage products.",
      },
    ],
  },
  {
    program_id: "calhfa_myaccess",
    name: "CalHFA MyAccess Program",
    mvp_tier: "tier_1",
    category: "state_down_payment_assistance",
    geography: "California (statewide, CalHFA)",
    assistance_max_text:
      "Deferred-payment junior loan for down payment and closing costs when paired with certain CalHFA first mortgages.",
    official_urls: ["https://www.calhfa.ca.gov/homebuyer/programs/myaccess.htm"],
    last_verified: "2026-02-15T00:00:00.000Z",
    status: "open",
    required_fields: ["occupancy", "first_time_buyer"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program is generally for owner-occupied homes.",
      },
      {
        label: "First-time or similar buyer",
        test: (e) => e.first_time_buyer !== "no",
        fail_reason: "Program is commonly positioned for first-time or comparable buyers.",
      },
    ],
  },
  {
    program_id: "calhfa_forgivable_equity_builder",
    name: "CalHFA Forgivable Equity Builder Loan",
    mvp_tier: "tier_2",
    category: "state_down_payment_assistance",
    geography: "California (statewide, CalHFA)",
    assistance_max_text:
      "Up-front assistance that may be forgiven after meeting occupancy and time-in-home requirements (funding-dependent).",
    official_urls: ["https://www.calhfa.ca.gov/loanprograms/archives/"],
    last_verified: "2026-02-15T00:00:00.000Z",
    status: "open",
    required_fields: ["occupancy", "first_time_buyer"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program is generally for owner-occupied primary residences.",
      },
      {
        label: "First-time buyer focus",
        test: (e) => e.first_time_buyer !== "no",
        fail_reason: "Program is typically limited to first-time buyers under CalHFA rules.",
      },
    ],
  },
  {
    program_id: "gsfa_golden_opportunities",
    name: "GSFA Golden Opportunities (GO)",
    mvp_tier: "tier_1",
    category: "state_down_payment_assistance",
    geography: "California (statewide, participating lenders)",
    assistance_max_text:
      "Down payment and closing cost assistance second mortgage offered through participating GSFA lenders.",
    official_urls: ["https://www.gsfahome.org/programs/dpa/go.shtml"],
    last_verified: "2026-02-15T00:00:00.000Z",
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
    program_id: "fhlb_sf_wish",
    name: "FHLBank San Francisco – Workforce Initiative Subsidy for Homeownership (WISH)",
    mvp_tier: "tier_2",
    category: "lender_grant",
    geography: "California (via participating FHLBank San Francisco member lenders)",
    assistance_max_text:
      "Matching grant funds toward down payment/closing costs for eligible low- to moderate-income households, accessed via member lenders.",
    official_urls: [
      "https://www.fhlbsf.com/community-investment/homeownership-programs/workforce-initiative-subsidy-for-homeownership/",
    ],
    last_verified: "2026-02-15T00:00:00.000Z",
    status: "open",
    required_fields: ["occupancy", "income_ami_band"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Grant support is generally tied to owner-occupied homes.",
      },
      {
        label: "Low- or moderate-income household",
        test: (e) => e.income_ami_band === "<=80" || e.income_ami_band === "81-120",
        fail_reason: "Program is targeted to low- or moderate-income buyers.",
      },
    ],
  },
  {
    program_id: "fhlb_sf_middle_income_dpa",
    name: "FHLBank San Francisco – Middle-Income Downpayment Assistance",
    mvp_tier: "tier_2",
    category: "lender_grant",
    geography: "California (via participating FHLBank San Francisco member lenders)",
    assistance_max_text:
      "Grant assistance for middle-income first-time buyers, accessed through participating lenders (funding-limited).",
    official_urls: [
      "https://www.fhlbsf.com/community-investment/homeownership-programs/middle-income-downpayment-assistance/",
    ],
    last_verified: "2026-02-15T00:00:00.000Z",
    status: "open",
    required_fields: ["occupancy", "first_time_buyer", "income_ami_band"],
    checks: [
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Grant support is generally tied to owner-occupied homes.",
      },
      {
        label: "First-time buyer",
        test: (e) => e.first_time_buyer !== "no",
        fail_reason: "Program is generally limited to first-time buyers.",
      },
      {
        label: "Middle-income household focus",
        test: (e) => e.income_ami_band === "81-120" || e.income_ami_band === ">120",
        fail_reason: "Program is designed for buyers above traditional low-income limits.",
      },
    ],
  },
  {
    program_id: "lacda_hop",
    name: "Los Angeles County HOP (Home Ownership Program)",
    mvp_tier: "tier_2",
    category: "local_down_payment_assistance",
    geography: "Los Angeles County (unincorporated + participating cities)",
    assistance_max_text:
      "County-administered down payment and closing cost assistance for low/moderate-income first-time buyers.",
    official_urls: ["https://www.lacda.org/residents/homeowners/home-ownership-program"],
    last_verified: "2026-02-15T00:00:00.000Z",
    status: "open",
    required_fields: [],
    checks: [
      {
        label: "Home is in Los Angeles County",
        test: (e) => {
          const loc = (e.location || "").toLowerCase();
          return loc.includes("los angeles") || loc.includes("la county");
        },
        fail_reason: "Program appears limited to homes within Los Angeles County.",
      },
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program generally requires the home to be a primary residence.",
      },
      {
        label: "First-time buyer",
        test: (e) => e.first_time_buyer !== "no",
        fail_reason: "Program is typically limited to first-time buyers.",
      },
    ],
  },
  {
    program_id: "la_city_lipa",
    name: "City of Los Angeles – Low Income Purchase Assistance (LIPA)",
    mvp_tier: "tier_1",
    category: "local_down_payment_assistance",
    geography: "City of Los Angeles",
    assistance_max_text:
      "Deferred-payment purchase assistance for low-income first-time buyers in the City of Los Angeles.",
    official_urls: [
      "https://housing.lacity.gov/residents/homeownership/first-time-homebuyers",
    ],
    last_verified: "2026-02-15T00:00:00.000Z",
    status: "open",
    required_fields: [],
    checks: [
      {
        label: "Home is in the City of Los Angeles",
        test: (e) => {
          const loc = (e.location || "").toLowerCase();
          return loc.includes("los angeles");
        },
        fail_reason: "Program is limited to homes within the City of Los Angeles.",
      },
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program generally requires the home to be a primary residence.",
      },
      {
        label: "First-time buyer",
        test: (e) => e.first_time_buyer !== "no",
        fail_reason: "Program is limited to first-time buyers.",
      },
    ],
  },
  {
    program_id: "la_city_mipa",
    name: "City of Los Angeles – Mortgage Assistance Program (MIPA)",
    mvp_tier: "tier_2",
    category: "local_down_payment_assistance",
    geography: "City of Los Angeles",
    assistance_max_text:
      "Deferred-payment down payment/closing cost assistance aimed at moderate-income first-time buyers in Los Angeles.",
    official_urls: [
      "https://housing.lacity.gov/residents/homeownership/first-time-homebuyers",
    ],
    last_verified: "2026-02-15T00:00:00.000Z",
    status: "open",
    required_fields: [],
    checks: [
      {
        label: "Home is in the City of Los Angeles",
        test: (e) => {
          const loc = (e.location || "").toLowerCase();
          return loc.includes("los angeles");
        },
        fail_reason: "Program is limited to homes within the City of Los Angeles.",
      },
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program generally requires the home to be a primary residence.",
      },
      {
        label: "First-time buyer",
        test: (e) => e.first_time_buyer !== "no",
        fail_reason: "Program is generally limited to first-time buyers.",
      },
    ],
  },
  {
    program_id: "la_city_mcc",
    name: "City of Los Angeles – Mortgage Credit Certificate (MCC) Program",
    mvp_tier: "tier_3",
    category: "tax_credit",
    geography: "City of Los Angeles",
    assistance_max_text:
      "Mortgage Credit Certificate that converts a portion of mortgage interest into a federal tax credit.",
    official_urls: [
      "https://housing.lacity.gov/residents/homeownership/mortgage-credit-certificate-mcc-program",
    ],
    last_verified: "2026-02-15T00:00:00.000Z",
    status: "open",
    required_fields: [],
    checks: [
      {
        label: "Home is in the City of Los Angeles",
        test: (e) => {
          const loc = (e.location || "").toLowerCase();
          return loc.includes("los angeles");
        },
        fail_reason: "Program is limited to homes within the City of Los Angeles.",
      },
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "MCCs are generally tied to owner-occupied primary residences.",
      },
    ],
  },
  {
    program_id: "sf_dalp",
    name: "San Francisco DALP (Downpayment Assistance Loan Program)",
    mvp_tier: "tier_1",
    category: "local_down_payment_assistance",
    geography: "City and County of San Francisco",
    assistance_max_text:
      "San Francisco down payment assistance loan program with funding pools that can include educator and first responder allocations.",
    official_urls: ["https://sfmohcd.org/dalp"],
    last_verified: "2026-02-15T00:00:00.000Z",
    status: "open",
    required_fields: [],
    checks: [
      {
        label: "Home is in San Francisco",
        test: (e) => {
          const loc = (e.location || "").toLowerCase();
          return loc.includes("san francisco");
        },
        fail_reason: "Program is limited to homes within San Francisco.",
      },
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program generally requires the home to be a primary residence.",
      },
      {
        label: "First-time buyer",
        test: (e) => e.first_time_buyer !== "no",
        fail_reason: "Program is generally limited to first-time buyers.",
      },
    ],
  },
  {
    program_id: "sf_frdalp",
    name: "San Francisco FRDALP (First Responder Down Payment Assistance Loan Program)",
    mvp_tier: "tier_1",
    category: "first_responder_down_payment_assistance",
    geography: "City and County of San Francisco",
    assistance_max_text:
      "Down payment assistance loan program restricted to eligible first responders in San Francisco.",
    official_urls: [
      "https://sf.gov/information/first-responder-down-payment-assistance-loan-program-frdalp",
    ],
    last_verified: "2026-02-15T00:00:00.000Z",
    status: "open",
    required_fields: [],
    checks: [
      {
        label: "Home is in San Francisco",
        test: (e) => {
          const loc = (e.location || "").toLowerCase();
          return loc.includes("san francisco");
        },
        fail_reason: "Program is limited to homes within San Francisco.",
      },
      {
        label: "First responder role",
        test: (e) =>
          e.hero_type === "law_enforcement" || e.hero_type === "firefighter_emt",
        fail_reason:
          "Program is restricted to eligible first responders under San Francisco rules.",
      },
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program generally requires the home to be a primary residence.",
      },
    ],
  },
  {
    program_id: "ac_boost",
    name: "Alameda County – AC Boost",
    mvp_tier: "tier_2",
    category: "local_down_payment_assistance",
    geography: "Alameda County (participating cities)",
    assistance_max_text:
      "Countywide down payment assistance administered through Alameda County, with income and price limits.",
    official_urls: ["https://www.acboost.org/"],
    last_verified: "2026-02-15T00:00:00.000Z",
    status: "open",
    required_fields: [],
    checks: [
      {
        label: "Home is in Alameda County",
        test: (e) => {
          const loc = (e.location || "").toLowerCase();
          return loc.includes("alameda");
        },
        fail_reason: "Program appears limited to homes within Alameda County.",
      },
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program generally requires the home to be a primary residence.",
      },
      {
        label: "First-time buyer",
        test: (e) => e.first_time_buyer !== "no",
        fail_reason: "Program is generally limited to first-time buyers.",
      },
    ],
  },
  {
    program_id: "oc_map",
    name: "Orange County – Mortgage Assistance Program (MAP)",
    mvp_tier: "tier_2",
    category: "local_down_payment_assistance",
    geography: "Orange County",
    assistance_max_text:
      "Deferred-payment down payment/closing cost assistance for low/moderate-income first-time buyers in Orange County.",
    official_urls: ["https://ochousing.org/housing-development/mortgage-assistance-program-map"],
    last_verified: "2026-02-15T00:00:00.000Z",
    status: "open",
    required_fields: [],
    checks: [
      {
        label: "Home is in Orange County",
        test: (e) => {
          const loc = (e.location || "").toLowerCase();
          return loc.includes("orange county") || loc.includes("orange, ca");
        },
        fail_reason: "Program appears limited to homes within Orange County.",
      },
      {
        label: "Primary residence occupancy",
        test: (e) => e.occupancy === "primary",
        fail_reason: "Program generally requires the home to be a primary residence.",
      },
      {
        label: "First-time buyer",
        test: (e) => e.first_time_buyer !== "no",
        fail_reason: "Program is generally limited to first-time buyers.",
      },
    ],
  },
  {
    program_id: "usda_rural_path",
    name: "USDA Rural Development – Home Loan Path (CA)",
    mvp_tier: "tier_3",
    category: "federal_product",
    geography: "California (USDA-eligible rural areas)",
    assistance_max_text:
      "USDA-backed home loan options for eligible buyers in USDA-eligible rural areas of California.",
    official_urls: ["https://eligibility.sc.egov.usda.gov/"],
    last_verified: "2026-02-15T00:00:00.000Z",
    status: "open",
    required_fields: [],
    checks: [
      {
        label: "Exploring USDA-eligible rural options",
        test: () => true,
        fail_reason:
          "USDA eligibility depends on property and income checks; this is shown as a potential loan path only.",
      },
    ],
  },
];

export type { ProgramRecord as Program };
