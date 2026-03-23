import { readdir } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3001";
const appDir = path.resolve(process.cwd(), "app");

const routeScenarios = new Map([
  ["/", "/"],
  ["/choose", "/choose?mission=buy"],
  ["/audience", "/audience?mission=buy"],
  ["/military", "/military?mission=buy&lane=service&service_track=military"],
  ["/military-status", "/military-status?mission=buy&lane=service&service_track=military"],
  ["/branch", "/branch?mission=buy&lane=service&service_track=military&service_status=active_duty&audience=military"],
  ["/rank", "/rank?mission=buy&lane=service&service_track=military&service_status=active_duty&branch=army&audience=military"],
  ["/years-of-service", "/years-of-service?mission=buy&lane=service&service_track=military&service_status=active_duty&branch=army&rank=E6&audience=military"],
  ["/family-profile", "/family-profile?mission=buy&lane=service&service_track=military&service_status=active_duty&branch=army&rank=E6&years_of_service=6_10&audience=military"],
  ["/first-responder", "/first-responder?mission=buy&lane=service&service_track=fr"],
  ["/first-responder-affiliation", "/first-responder-affiliation?mission=buy&lane=service&service_track=fr&role=Fire&audience=first_responder"],
  ["/education-role", "/education-role?mission=buy&lane=service&service_track=public_servant"],
  ["/education-years", "/education-years?mission=buy&lane=service&service_track=public_servant&role=teacher&education_level=6_8"],
  ["/medical-role", "/medical-role?mission=buy&lane=service&service_track=medical"],
  ["/medical-years", "/medical-years?mission=buy&lane=service&service_track=medical&role=nurse"],
  ["/ministry-organization", "/ministry-organization?mission=buy&lane=service&service_track=ministry"],
  ["/ministry-years", "/ministry-years?mission=buy&lane=service&service_track=ministry&organization=church"],
  ["/public-servant-organization", "/public-servant-organization?mission=buy&lane=service&service_track=public_servant"],
  ["/public-servant-role", "/public-servant-role?mission=buy&lane=service&service_track=public_servant&organization=city"],
  ["/public-servant-years", "/public-servant-years?mission=buy&lane=service&service_track=public_servant&organization=city&role=teacher"],
  ["/mission", "/mission?mission=buy&lane=service&service_track=fr&role=Fire&audience=first_responder"],
  ["/service-category", "/service-category?mission=buy&lane=service&service_track=military"],
  ["/home-preferences", "/home-preferences?mission=buy&lane=service&service_track=fr&role=Fire&audience=first_responder"],
  ["/location", "/location?mission=buy&lane=service&service_track=fr&role=Fire&audience=first_responder&home_property_type=condo&home_bedrooms=2&home_preferences=condo%2C2_bedrooms"],
  ["/financing-status", "/financing-status?mission=buy&lane=service&service_track=fr&role=Fire&audience=first_responder&home_property_type=condo&home_bedrooms=2&home_preferences=condo%2C2_bedrooms&location=92028"],
  ["/preapproval-help", "/preapproval-help?mission=buy&lane=service&service_track=fr&role=Fire&audience=first_responder&home_property_type=condo&home_bedrooms=2&home_preferences=condo%2C2_bedrooms&location=59718&financing=need_help"],
  ["/preapproved-details", "/preapproved-details?mission=buy&lane=service&service_track=fr&role=Fire&audience=first_responder&home_property_type=condo&home_bedrooms=2&home_preferences=condo%2C2_bedrooms&location=92028&financing=preapproved"],
  ["/buy-timeline", "/buy-timeline?next=review&mission=buy&lane=service&service_track=fr&role=Fire&audience=first_responder&home_property_type=condo&home_bedrooms=2&home_preferences=condo%2C2_bedrooms&location=92028&financing=preapproved&loan_type=FHA&budget_range=%24400K-%24600K&shop_lenders="],
  ["/match-preview", "/match-preview?mission=buy&lane=service&service_track=fr&role=Fire&audience=first_responder&home_property_type=condo&home_bedrooms=2&home_preferences=condo%2C2_bedrooms&location=92028&financing=preapproved&loan_type=FHA&budget_range=%24400K-%24600K&shop_lenders=&timeline=1-3"],
  ["/programs-check", "/programs-check?mission=buy&lane=service&service_track=fr&role=Fire&audience=first_responder&home_property_type=condo&home_bedrooms=2&home_preferences=condo%2C2_bedrooms&location=92028&financing=preapproved&loan_type=FHA&budget_range=%24400K-%24600K&shop_lenders=&timeline=1-3"],
  ["/programs-scan", "/programs-scan?mission=buy&lane=service&service_track=fr&role=Fire&audience=first_responder&home_property_type=condo&home_bedrooms=2&home_preferences=condo%2C2_bedrooms&location=92028&financing=preapproved&loan_type=FHA&budget_range=%24400K-%24600K&shop_lenders=&timeline=1-3&first_time_buyer=yes&occupancy=primary&household_size=5&income_band=80_120k"],
  ["/programs-results", "/programs-results?mission=buy&lane=service&service_track=fr&role=Fire&audience=first_responder&home_property_type=condo&home_bedrooms=2&home_preferences=condo%2C2_bedrooms&location=92028&financing=preapproved&loan_type=FHA&budget_range=%24400K-%24600K&shop_lenders=&timeline=1-3&first_time_buyer=yes&occupancy=primary&household_size=5&income_band=80_120k"],
  ["/programs-offer", "/programs-offer?program_id=calhfa_myhome&mission=buy&location=92028"],
  ["/sell-property", "/sell-property?mission=sell"],
  ["/sell-status", "/sell-status?mission=sell&property_type=single_family&property_location=92028"],
  ["/sell-timeline", "/sell-timeline?mission=sell&property_type=single_family&property_location=92028&sell_status=listed"],
  ["/sell-motivation", "/sell-motivation?mission=sell&property_type=single_family&property_location=92028&sell_status=listed&sell_timeline=0_3_months"],
  ["/rental-property", "/rental-property?mission=manage"],
  ["/rental-status", "/rental-status?mission=manage&rental_property_type=single_family&rental_location=92028"],
  ["/rental-timeline", "/rental-timeline?mission=rent&rental_property_type=apartment&rental_location=92028"],
  ["/rental-numbers", "/rental-numbers?mission=manage&rental_property_type=single_family&rental_location=92028&rental_status=occupied"],
  ["/rental-needs", "/rental-needs?mission=manage&rental_property_type=single_family&rental_location=92028&rental_status=occupied&door_count=1_4&units_vacant=0"],
  ["/timeline", "/timeline?mission=rent&rental_property_type=apartment&rental_location=92028"],
  ["/scan", "/scan?mission=rent&rental_location=92028&rental_property_type=apartment&timeline=asap&bedrooms=2"],
  ["/review", "/review?mission=buy&lane=service&service_track=fr&role=Fire&audience=first_responder&home_property_type=condo&home_bedrooms=2&home_preferences=condo%2C2_bedrooms&location=92028&financing=preapproved&loan_type=FHA&budget_range=%24400K-%24600K&shop_lenders=&timeline=1-3"],
  ["/contact", "/contact?mission=sell&property_type=single_family&property_location=92028&sell_status=listed&sell_timeline=0_3_months&sell_motivation=upgrade"],
  ["/verify", "/verify?mission=buy&service_track=military&branch=army&rank=E6"],
  ["/consent", "/consent?mission=sell&name=Test+User&email=test%40example.com&phone=5551234567"],
  ["/confirmation", "/confirmation?mission=sell&name=Test+User&email=test%40example.com&phone=5551234567"],
  ["/completion", "/completion"],
  ["/refer", "/refer?ref=demo"],
  ["/refer-location", "/refer-location?mission=buy"],
  ["/refer-timeline", "/refer-timeline?mission=buy&friend_location=92028"],
  ["/refer-consent", "/refer-consent?mission=buy&friend_name=Test+Friend&friend_location=92028"],
  ["/refer-confirmation", "/refer-confirmation"],
  ["/relation", "/relation?mission=buy"],
  ["/partner", "/partner"],
  ["/partner/login", "/partner/login?next=/partner"],
  ["/partner/signup", "/partner/signup?type=ambassador"],
  ["/partner/dashboard", "/partner/dashboard"],
  ["/partner/bulk-entry", "/partner/bulk-entry"],
  ["/partner/complete", "/partner/complete"],
  ["/share", "/share"],
  ["/compare-lenders", "/compare-lenders?mission=buy&location=92028"],
  ["/privacy-policy", "/privacy-policy"],
  ["/terms", "/terms"],
  ["/reviews", "/reviews"],
  ["/admin", "/admin"],
  ["/admin/lead-test", "/admin/lead-test"],
]);

const apiScenarios = [
  {
    name: "health",
    method: "GET",
    path: "/api/health",
  },
  {
    name: "match-ca",
    method: "POST",
    path: "/api/match",
    body: {
      input: {
        mission: "buy",
        location: "92028",
        first_time_buyer: "yes",
        occupancy: "primary",
        household_size: "3",
        income_band: "80_120k",
        service_track: "military",
        hero_type: "veteran",
      },
    },
  },
  {
    name: "match-non-ca",
    method: "POST",
    path: "/api/match",
    body: {
      input: {
        mission: "buy",
        location: "59718",
        first_time_buyer: "yes",
        occupancy: "primary",
        household_size: "2",
        income_band: "80_120k",
        service_track: "military",
        hero_type: "veteran",
      },
    },
  },
  {
    name: "match-non-ca-civilian",
    method: "POST",
    path: "/api/match",
    body: {
      input: {
        mission: "buy",
        location: "59718",
        first_time_buyer: "yes",
        occupancy: "primary",
        household_size: "2",
        income_band: "80_120k",
        loan_type: "Conventional",
        audience: "civilian",
      },
    },
  },
  {
    name: "match-ca-wells-priority",
    method: "POST",
    path: "/api/match",
    body: {
      input: {
        mission: "buy",
        location: "92028",
        first_time_buyer: "yes",
        occupancy: "primary",
        household_size: "2",
        income_band: "80_120k",
        loan_type: "Conventional",
        audience: "civilian",
      },
    },
  },
  {
    name: "match-non-ca-usda-direct",
    method: "POST",
    path: "/api/match",
    body: {
      input: {
        mission: "buy",
        location: "59001",
        first_time_buyer: "yes",
        occupancy: "primary",
        household_size: "3",
        income_band: "lt_80k",
        audience: "civilian",
      },
    },
  },
];

async function findRoutes(dir, base = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const routes = [];

  for (const entry of entries) {
    if (entry.name.startsWith("_") || entry.name === "api") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      routes.push(...(await findRoutes(fullPath, `${base}/${entry.name}`)));
      continue;
    }
    if (entry.isFile() && entry.name === "page.tsx") {
      routes.push(base || "/");
    }
  }

  return routes;
}

function bodyLooksBroken(text) {
  return [
    "application error",
    "server error",
    "failed to load",
    "unhandled runtime error",
    "something went wrong",
  ].some((token) => text.toLowerCase().includes(token));
}

async function checkPage(route) {
  const scenario = routeScenarios.get(route) || route;
  const res = await fetch(`${baseUrl}${scenario}`, { redirect: "manual" });
  const text = await res.text();
  const ok = res.status >= 200 && res.status < 400 && !bodyLooksBroken(text);
  return {
    kind: "page",
    route,
    scenario,
    status: res.status,
    ok,
  };
}

async function checkApi(api) {
  const init = {
    method: api.method,
    headers: api.body ? { "content-type": "application/json" } : undefined,
    body: api.body ? JSON.stringify(api.body) : undefined,
  };
  const res = await fetch(`${baseUrl}${api.path}`, init);
  const text = await res.text();
  let ok = res.status >= 200 && res.status < 400 && !bodyLooksBroken(text);

  if (ok && api.path === "/api/match") {
    const json = JSON.parse(text);
    const programs = [...(json.matched || []), ...(json.maybe || [])];
    const hasCaliforniaProgram = programs.some((program) =>
      String(program.geography || "").toLowerCase().includes("california")
    );
    const hasNationwideProgram = programs.some((program) =>
      String(program.geography || "").toLowerCase().includes("united states")
    );
    const hasNonFhaNationwide = programs.some((program) => {
      const geography = String(program.geography || "").toLowerCase();
      const name = String(program.name || "").toLowerCase();
      return geography.includes("united states") && !name.includes("fha");
    });
    const firstProgramId = programs[0]?.program_id || "";
    const hasUsdaDirect = programs.some((program) => program.program_id === "usda_direct_loan_path");

    if (api.name === "match-ca") {
      ok = hasCaliforniaProgram;
    }

    if (api.name === "match-non-ca") {
      ok = hasNationwideProgram && !hasCaliforniaProgram;
    }

    if (api.name === "match-non-ca-civilian") {
      ok = hasNationwideProgram && !hasCaliforniaProgram && hasNonFhaNationwide;
    }

    if (api.name === "match-ca-wells-priority") {
      ok = firstProgramId.startsWith("wells_");
    }

    if (api.name === "match-non-ca-usda-direct") {
      ok = hasUsdaDirect && !hasCaliforniaProgram;
    }
  }

  return {
    kind: "api",
    route: api.path,
    scenario: api.name,
    status: res.status,
    ok,
    text,
  };
}

const routes = (await findRoutes(appDir)).sort();
const pageResults = [];
for (const route of routes) {
  pageResults.push(await checkPage(route));
}

const apiResults = [];
for (const api of apiScenarios) {
  apiResults.push(await checkApi(api));
}

const failures = [...pageResults, ...apiResults].filter((result) => !result.ok);

for (const result of pageResults) {
  console.log(`[PAGE] ${result.status} ${result.scenario}`);
}

for (const result of apiResults) {
  console.log(`[API] ${result.status} ${result.scenario}`);
}

if (failures.length > 0) {
  console.error("\nSmoke test failures:");
  for (const failure of failures) {
    console.error(`- ${failure.kind.toUpperCase()} ${failure.status} ${failure.scenario}`);
    if (failure.kind === "api") {
      console.error(`  Response: ${failure.text.slice(0, 300)}`);
    }
  }
  process.exitCode = 1;
} else {
  console.log(`\nSmoke tests passed for ${pageResults.length} pages and ${apiResults.length} API scenarios.`);
}