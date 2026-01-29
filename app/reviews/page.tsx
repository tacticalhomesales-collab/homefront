"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// --- Review Data Generation ---
const FIRST_NAMES = [
  "Jessica", "Michael", "Ava", "David", "Emily", "Carlos", "Sophia", "Brian", "Olivia", "William",
  "Grace", "Ethan", "Mia", "Benjamin", "Zoe", "Lucas", "Harper", "Jack", "Ella", "Henry",
  "Chloe", "Samuel", "Lily", "Matthew", "Scarlett", "Daniel", "Victoria", "Logan", "Penelope", "Mason",
  "Layla", "Sebastian", "Aria", "Elijah", "Camila", "Carter", "Nora", "Wyatt", "Hazel", "Julian",
  "Aurora", "Levi", "Savannah", "Lincoln", "Stella", "Hunter", "Violet", "Easton", "Paisley", "Christian",
  "Brooke", "Dylan", "Madison", "Owen", "Isabella", "Gabriel", "Sofia", "Jackson", "Avery", "Luke",
  "Ella", "Mila", "Liam", "Charlotte", "Noah", "Amelia", "James", "Elena", "Logan", "Abigail",
  "Jacob", "Emily", "Mason", "Scarlett", "Oliver", "Layla", "Elijah", "Aria", "Lucas", "Aiden"
];
const LAST_NAMES = [
  "Turner", "Chen", "Patel", "Kim", "Johnson", "Rivera", "Lee", "Smith", "Martinez", "Brown",
  "Wilson", "Nguyen", "Clark", "Hall", "Adams", "Scott", "Evans", "White", "King", "Lewis",
  "Walker", "Young", "Harris", "Allen", "Wright", "Green", "Baker", "Carter", "Nelson", "Perez",
  "Roberts", "Campbell", "Murphy", "Bell", "Cooper", "Foster", "Simmons", "Morris", "Reed", "Bailey",
  "Brooks", "Powell", "Barnes", "Ross", "Hayes", "Jenkins", "Griffin", "Butler", "Reed", "Bailey"
];
const BASE_CITIES = [
  { city: "Oceanside", state: "CA", base: "Camp Pendleton", titles: ["Marine", "Retired Marine", "Military Spouse", "Navy Corpsman", "Civilian Contractor"] },
  { city: "Killeen", state: "TX", base: "Fort Cavazos", titles: ["Army Sergeant", "Retired Army", "Military Spouse", "Civilian Contractor"] },
  { city: "Fayetteville", state: "NC", base: "Fort Liberty", titles: ["Army Captain", "Retired Army", "Military Spouse", "Civilian Contractor"] },
  { city: "Tacoma", state: "WA", base: "Joint Base Lewis-McChord", titles: ["Air Force Pilot", "Army Specialist", "Retired Air Force", "Military Spouse"] },
  { city: "Norfolk", state: "VA", base: "Naval Station Norfolk", titles: ["Navy Chief", "Retired Navy", "Military Spouse", "Civilian Contractor"] },
  { city: "El Paso", state: "TX", base: "Fort Bliss", titles: ["Army Staff Sergeant", "Retired Army", "Military Spouse"] },
  { city: "Colorado Springs", state: "CO", base: "Peterson/Schriever SFB", titles: ["Space Force Officer", "Air Force Veteran", "Military Spouse"] },
  { city: "San Antonio", state: "TX", base: "Joint Base San Antonio", titles: ["Air Force Tech Sergeant", "Retired Air Force", "Military Spouse"] },
  { city: "Augusta", state: "GA", base: "Fort Eisenhower", titles: ["Army Major", "Retired Army", "Military Spouse"] },
  { city: "Honolulu", state: "HI", base: "Joint Base Pearl Harbor-Hickam", titles: ["Navy Petty Officer", "Retired Navy", "Military Spouse"] }
];
const CITIES = [
  ...BASE_CITIES.map(b => b.city),
  "San Diego", "Austin", "Seattle", "Denver", "Charlotte", "Phoenix", "Portland", "Tampa", "Chicago", "Atlanta",
  "Dallas", "Las Vegas", "Orlando", "Salt Lake City", "Raleigh", "Sacramento", "Nashville", "Kansas City", "Minneapolis", "Columbus",
  "Richmond", "Omaha", "Louisville", "Albuquerque", "Boise", "Tulsa", "Fresno", "Des Moines", "Madison", "Birmingham",
  "Buffalo", "Reno", "Spokane", "Little Rock", "Chattanooga", "Wichita", "Lincoln", "Toledo", "Fort Wayne", "St. Paul",
  "Lubbock", "Laredo", "Durham", "Garland", "Glendale", "Scottsdale", "Irving", "Hialeah", "Fremont", "Chesapeake"
];
const STATES = [
  "CA", "TX", "WA", "CO", "NC", "AZ", "OR", "FL", "IL", "GA",
  "TX", "NV", "FL", "UT", "NC", "CA", "TN", "MO", "MN", "OH",
  "VA", "NE", "KY", "NM", "ID", "OK", "CA", "IA", "WI", "AL",
  "NY", "NV", "WA", "AR", "TN", "KS", "NE", "OH", "IN", "MN",
  "TX", "TX", "NC", "TX", "AZ", "AZ", "TX", "FL", "CA", "VA"
];
const SERVICES = ["Bought", "Sold", "Rented", "Managed"];
const SERVICE_TAGS = {
  Bought: "Buyers",
  Sold: "Sellers",
  Rented: "Renters",
  Managed: "Landlords"
};
const SEO_WORDS = [
  "VA", "PCS", "BAH", "Military", "Veteran", "Relocation", "Base", "Offbase", "Housing", "Deployment", "Homebuying", "Preapproval", "Mortgage", "Rates", "Lender", "Downpayment", "ClosingCosts", "Inspection", "Escrow", "Affordability", "Selling", "Listing", "Pricing", "Staging", "Market", "Offers", "Appraisal", "Commissions", "Negotiation", "NetProceeds", "Renting", "Lease", "Deposit", "Apartment", "Application", "Screening", "Utilities", "Movein", "Roommate", "Eviction", "Landlord", "Tenants", "Vacancy", "Maintenance", "Cashflow", "Turnover", "Management", "LeaseRenewal", "ROI"
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomDateWithinLastYear(): string {
  const now = new Date();
  const past = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const date = new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
function randomSEO(service: string): string[] {
  // Pick 1-2 relevant SEO words for the service
  const map = {
    Bought: ["VA", "PCS", "BAH", "Military", "Veteran", "Relocation", "Base", "Offbase", "Homebuying", "Preapproval", "Mortgage", "Rates", "Lender", "Downpayment", "ClosingCosts", "Inspection", "Escrow", "Affordability"],
    Sold: ["Selling", "Listing", "Pricing", "Staging", "Market", "Offers", "Appraisal", "Commissions", "Negotiation", "NetProceeds", "Escrow"],
    Rented: ["Renting", "Lease", "Deposit", "Apartment", "Application", "Screening", "Utilities", "Movein", "Roommate", "Eviction"],
    Managed: ["Landlord", "Tenants", "Vacancy", "Maintenance", "Cashflow", "Turnover", "Management", "LeaseRenewal", "ROI"]
  };
  const pool: string[] = (map as any)[service] || SEO_WORDS;
  const picks: string[] = [];
  while (picks.length < 2) {
    const word = randomFrom(pool);
    if (!picks.includes(word)) picks.push(word);
  }
  return picks;
}
function reviewText(service: string, name: string, city: string, state: string, seo: string[]): string {
  // 30% chance for a teaching/guidance/negotiation themed review, otherwise use original logic
  if (Math.random() < 0.3) {
    const teaching = [
      `HomeFront taught us so much about the process—there's so much you don't know until someone walks you through it.`,
      `We learned more in a week with HomeFront than months of searching online. They explained every step.`,
      `They walked us through everything, from start to finish, and made sure we understood all our options.`,
      `HomeFront made sure we never felt lost. They taught us what to look for and what to avoid.`,
      `We didn't know what we didn't know, but HomeFront did—and they shared it all with us.`,
      `They explained things no one else ever mentioned and made us feel confident.`,
      `We were guided through every detail, and learned so much about the process.`,
      `HomeFront took the time to teach us, not just sell to us.`,
      `They made sure we understood every document and decision.`,
      `We felt empowered and informed at every step.`
    ];
    const negotiation = [
      `They negotiated on our behalf and got us incentives and savings we never would have found ourselves.`,
      `HomeFront found programs and deals no one else showed us.`,
      `We got closing cost credits and extras we didn't even know to ask for.`,
      `They researched every possible incentive and made sure we got the best deal.`,
      `HomeFront fought for us in negotiations and it paid off.`,
      `We ended up with more money in our pocket thanks to their negotiation skills.`,
      `They facilitated the whole transaction and made it easy.`,
      `We got incentives and upgrades that weren't even advertised.`,
      `HomeFront made sure we didn't leave any money on the table.`,
      `They handled everything, from research to negotiation to closing.`
    ];
    const facilitated = [
      `The whole transaction was smooth and stress-free.`,
      `They handled all the details and kept us updated.`,
      `We always knew what was happening and what came next.`,
      `HomeFront made the process feel easy, even when it was complicated.`,
      `They coordinated everything and made sure nothing slipped through the cracks.`,
      `We felt supported from start to finish.`,
      `Their team was always available to answer questions and guide us.`,
      `We never felt alone in the process.`,
      `HomeFront was with us every step of the way.`,
      `They made sure every part of the transaction was handled professionally.`
    ];
    const t = randomFrom(teaching);
    const n = randomFrom(negotiation);
    const f = randomFrom(facilitated);
    return `${t} ${n} ${f}`;
  }
  // ...existing code (original reviewText logic follows)...
  // 15% chance for a poorly written or negative review
  if (Math.random() < 0.15) {
    const badReviews = [
      `i dont realy like how the process went in ${city}, ${state}. it was confusing and took 2 long.`,
      `not happy with the service, wish i went with someone else.`,
      `they was late to call me back and i didnt get all my questions answerd.`,
      `the agent was nice but the paperwork was a mess.`,
      `i had to wait a lot. not what i expected.`,
      `some things was good but mostly just ok.`,
      `i dont think i would use again.`,
      `to many emails and not enuf help.`,
      `felt like i was just a number not a person.`,
      `the process was hard to understand and i got lost.`,
      `not the best experiance, but i did get a house.`,
      `wish they explained more.`,
      `i had to call a lot to get updates.`,
      `the website was slow and i got frustated.`,
      `not great, not terrible, just meh.`,
      `i dont like all the forms.`,
      `took longer than i thought.`,
      `i had to fix some mistakes myself.`,
      `the agent was ok but not super helpful.`,
      `i got a place but it was stressful.`
    ];
    return randomFrom(badReviews);
  }
  // Service-specific, SEO-integrated, realistic
  // If review is about "off base" or "base", use a base city and mention the base
  const baseObj = BASE_CITIES.find(b => b.city === city);
  if ((seo.includes("Base") || seo.includes("Offbase")) && baseObj) {
    if (service === "Bought") {
      const openers = [
        `Our PCS to ${baseObj.base} meant finding off base housing in ${city}, ${state}.`,
        `We needed a home near ${baseObj.base} in ${city}, ${state} for our military move.`,
        `Relocating to ${baseObj.base} brought us to ${city}, ${state} and HomeFront made it easy.`,
        `Finding a place off base at ${baseObj.base} in ${city}, ${state} was a challenge until HomeFront helped.`,
        `Our family moved to ${city}, ${state} for ${baseObj.base} and HomeFront guided us every step.`
      ];
      const opener = openers[Math.floor(Math.random() * openers.length)];
      return `${opener} HomeFront made the PCS and VA process easy, explained BAH, and helped us find the perfect home near base. Highly recommend for military families!`;
    } else if (service === "Rented") {
      const openers = [
        `Moving off base from ${baseObj.base} to ${city}, ${state} was a breeze.`,
        `We left base housing at ${baseObj.base} and rented in ${city}, ${state}.`,
        `Transitioning from ${baseObj.base} to civilian life in ${city}, ${state} was smooth with HomeFront.`,
        `Our off base rental near ${baseObj.base} in ${city}, ${state} was perfect.`,
        `Leaving ${baseObj.base}, we found a great rental in ${city}, ${state}.`
      ];
      const opener = openers[Math.floor(Math.random() * openers.length)];
      return `${opener} HomeFront explained the lease, helped with the application, and made sure utilities and move-in were stress-free.`;
    } else if (service === "Sold") {
      const openers = [
        `We sold our home near ${baseObj.base} in ${city}, ${state} with HomeFront's help.`,
        `Listing our house close to ${baseObj.base} in ${city}, ${state} was easy.`,
        `Selling to another military family PCSing to ${baseObj.base} in ${city}, ${state} was seamless.`,
        `Our property near ${baseObj.base} in ${city}, ${state} sold quickly.`,
        `HomeFront handled our sale near ${baseObj.base} in ${city}, ${state} expertly.`
      ];
      const opener = openers[Math.floor(Math.random() * openers.length)];
      return `${opener} Their listing and pricing strategy got us multiple offers from other military families PCSing to base.`;
    } else {
      // Managed, base
      const openers = [
        `Managing rentals near ${baseObj.base} in ${city}, ${state} is easier with HomeFront.`,
        `My off base property by ${baseObj.base} in ${city}, ${state} is in good hands with HomeFront.`,
        `I own several rentals close to ${baseObj.base} and HomeFront keeps my vacancy low.`,
        `As a property owner near ${baseObj.base}, I rely on HomeFront for tenant screening and maintenance.`,
        `HomeFront has been a great partner for my off base rental in ${city}, ${state}.`
      ];
      const opener = openers[Math.floor(Math.random() * openers.length)];
      return `${opener} They handle tenants, maintenance, and keep ROI strong.`;
    }
  }
  if (service === "Bought") {
    const openers = [
      `Buying my first home in ${city}, ${state} was overwhelming until I found HomeFront.`,
      `I never thought I'd own a home in ${city}, ${state}—HomeFront made it possible.`,
      `The ${seo[0]} process in ${city}, ${state} was confusing, but HomeFront explained everything.`,
      `After searching for months in ${city}, ${state}, HomeFront helped me get preapproved and close fast.`,
      `I was a ${seo[0]} eligible buyer in ${city}, ${state} and HomeFront guided me through every step.`,
      `HomeFront's team made my homebuying journey in ${city}, ${state} smooth and stress-free.`,
      `I compared lenders and found the best rate in ${city}, ${state} thanks to HomeFront.`,
      `From preapproval to closing in ${city}, ${state}, HomeFront was there for me.`,
      `I was nervous about the ${seo[1]} process, but HomeFront made it easy in ${city}, ${state}.`,
      `HomeFront explained every step and helped me buy my dream home in ${city}, ${state}.`
    ];
    const opener = openers[Math.floor(Math.random() * openers.length)];
    return `${opener}`;
  } else if (service === "Sold") {
    const openers = [
      `Selling my home in ${city}, ${state} was easy with HomeFront.`,
      `HomeFront's ${seo[0]} strategy in ${city}, ${state} got me multiple offers.`,
      `I got a great net proceeds selling in ${city}, ${state} with HomeFront.`,
      `Communication and escrow were seamless when I sold in ${city}, ${state}.`,
      `HomeFront advised me on ${seo[1]} and made selling in ${city}, ${state} stress-free.`,
      `I was impressed by HomeFront's pricing and listing advice in ${city}, ${state}.`,
      `My house sold quickly in ${city}, ${state} thanks to HomeFront.`,
      `I received multiple offers after listing with HomeFront in ${city}, ${state}.`,
      `HomeFront handled negotiations and got me top dollar in ${city}, ${state}.`,
      `Escrow and closing were smooth with HomeFront in ${city}, ${state}.`
    ];
    const opener = openers[Math.floor(Math.random() * openers.length)];
    return `${opener}`;
  } else if (service === "Rented") {
    const openers = [
      `Renting in ${city}, ${state} was a breeze with HomeFront.`,
      `HomeFront explained the ${seo[0]} and helped with my ${seo[1]} application in ${city}, ${state}.`,
      `I found a great apartment in ${city}, ${state} thanks to HomeFront.`,
      `The rental process in ${city}, ${state} was simple and clear.`,
      `HomeFront helped me understand my lease and move in fast in ${city}, ${state}.`,
      `I was new to ${city}, ${state} and HomeFront made renting easy.`,
      `My application was approved quickly in ${city}, ${state} with HomeFront's help.`,
      `I got all my questions answered about renting in ${city}, ${state}.`,
      `HomeFront made sure I understood every detail of my lease in ${city}, ${state}.`,
      `I recommend HomeFront to anyone renting in ${city}, ${state}.`
    ];
    const opener = openers[Math.floor(Math.random() * openers.length)];
    return `${opener}`;
  } else {
    // Managed, non-base: randomize openers
    const openers = [
      `My rental in ${city}, ${state} is finally stress-free thanks to HomeFront.`,
      `I trust HomeFront to manage my property in ${city}, ${state}.`,
      `HomeFront keeps my tenants happy and my property in great shape in ${city}, ${state}.`,
      `I appreciate HomeFront's help with ${seo[0]} and ${seo[1]} for my rental in ${city}, ${state}.`,
      `As a property owner in ${city}, ${state}, HomeFront has made management easy.`,
      `HomeFront's team handles everything for my rental in ${city}, ${state}.`,
      `I get regular updates and fast maintenance for my property in ${city}, ${state}.`,
      `My cashflow and ROI have improved since HomeFront started managing my rental in ${city}, ${state}.`,
      `Vacancy is down and tenant quality is up with HomeFront managing my property in ${city}, ${state}.`,
      `Lease renewals and turnovers are smooth with HomeFront in ${city}, ${state}.`
    ];
    const opener = openers[Math.floor(Math.random() * openers.length)];
    return `${opener} Highly recommend their management services!`;
  }
}

// Reviewer titles
const CIVIL_TITLES = ["Firefighter", "Police Officer", "Nurse", "Teacher", "Civilian", "Engineer", "Retired", "First Responder", "Paramedic", "Business Owner", "Veteran", "Realtor", "Landlord", "Property Manager"];
// Identity label logic
const BRANCHES = ["Navy","Marines","Army","Air Force","Coast Guard","Space Force"];
const JOBS = ["Mechanic","Electrician","Nurse","Teacher","Contractor","Engineer","Accountant","Chef","Plumber","Welder","IT Specialist","Project Manager","EMT","Small Business Owner"];
const RESPONDER_JOBS = ["Firefighter","Police Officer","Paramedic","Dispatcher","EMT","Sheriff’s Deputy"];

type Review = {
  name: string;
  location: string;
  service: string;
  text: string;
  date: string;
  title: string;
  audienceType: "military" | "first_responder" | "civilian";
  identityLabel: string;
};

function getAudienceTypeAndIdentityLabel(review: any, idx: number): { audienceType: "military" | "first_responder" | "civilian"; identityLabel: string } {
  const branch = BRANCHES[idx % BRANCHES.length];
  const job = JOBS[idx % JOBS.length];
  const responderJob = RESPONDER_JOBS[idx % RESPONDER_JOBS.length];
  const text = (review.text || "") + " " + (review.title || "") + " " + (review.service || "");
  const lower = text.toLowerCase();
  // Military signals
  const militarySignals = ["va","pcs","bah","military","veteran","deployment","offbase","base","camp pendleton","miramar","fort","nas","mcas","active duty"];
  const retiredSignals = ["retired"];
  const veteranSignals = ["veteran"];
  const responderSignals = ["first responder","firefighter","police","paramedic","dispatcher","emt","sheriff"];

  // First responder
  if (responderSignals.some(sig => lower.includes(sig))) {
    return { audienceType: "first_responder", identityLabel: responderJob };
  }
  // Military
  if (militarySignals.some(sig => lower.includes(sig))) {
    if (retiredSignals.some(sig => lower.includes(sig))) {
      return { audienceType: "military", identityLabel: `Retired ${branch}` };
    }
    if (veteranSignals.some(sig => lower.includes(sig))) {
      return { audienceType: "military", identityLabel: `${branch} Veteran` };
    }
    return { audienceType: "military", identityLabel: `Active Duty ${branch}` };
  }
  // Civilian
  return { audienceType: "civilian", identityLabel: job };
}

const REVIEWS: Review[] = Array.from({ length: 200 }, (_, i) => {
  // ...existing code...
  const service = randomFrom(SERVICES);
  let city = randomFrom(CITIES);
  let state = randomFrom(STATES);
  let baseObj = BASE_CITIES.find(b => b.city === city);
  const first = randomFrom(FIRST_NAMES);
  const last = randomFrom(LAST_NAMES);
  const name = `${first} ${last}`;
  const date = randomDateWithinLastYear();
  const seo = randomSEO(service);
  let title = randomFrom(CIVIL_TITLES);
  if (seo.some(word => ["Military", "Base", "Offbase", "PCS", "BAH", "Deployment", "Veteran"].includes(word))) {
    const forcedBase = randomFrom(BASE_CITIES);
    city = forcedBase.city;
    state = forcedBase.state;
    title = randomFrom(forcedBase.titles);
  }
  const text = reviewText(service, name, city, state, seo);
  const reviewObj = { name, location: `${city}, ${state}`, service, text, date, title };
  const { audienceType, identityLabel } = getAudienceTypeAndIdentityLabel(reviewObj, i);
  return { ...reviewObj, audienceType, identityLabel };
});

function getServiceColor(service: string): string {
  switch (service) {
    case "Bought":
      return "bg-blue-500/20 text-blue-200 border-blue-400/30";
    case "Sold":
      return "bg-green-500/20 text-green-200 border-green-400/30";
    case "Rented":
      return "bg-yellow-500/20 text-yellow-200 border-yellow-400/30";
    case "Managed":
      return "bg-purple-500/20 text-purple-200 border-purple-400/30";
    default:
      return "bg-white/10 text-white";
  }
}

const FILTERS = [
  { label: "All", value: "All" },
  { label: "Buyers", value: "Bought" },
  { label: "Sellers", value: "Sold" },
  { label: "Renters", value: "Rented" },
  { label: "Landlords", value: "Managed" }
];

export default function ReviewsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? REVIEWS : REVIEWS.filter(r => r.service === filter);

  return (
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-2 sm:px-4 pb-10 relative">
      {/* HomeFront logo top right */}
      <div className="absolute top-4 right-4 z-20 hidden sm:block">
        <img
          src="/homefront-badge.png"
          alt="HomeFront"
          className="w-[300px] h-auto drop-shadow-xl select-none pointer-events-none"
          style={{ maxWidth: "360px", maxHeight: "300px", objectFit: "contain" }}
          draggable={false}
        />
      </div>
      {/* HomeFront logo top left (mirrored) */}
      <div className="absolute top-4 left-4 z-20 hidden sm:block">
        <img
          src="/homefront-badge.png"
          alt="HomeFront"
          className="w-[300px] h-auto drop-shadow-xl select-none pointer-events-none"
          style={{ maxWidth: "360px", maxHeight: "300px", objectFit: "contain" }}
          draggable={false}
        />
      </div>
      <div className="max-w-3xl mx-auto pt-8">
        <button
          onClick={() => router.back()}
          className="mb-6 text-white/80 hover:text-white underline text-sm font-semibold focus:outline-none"
        >
          ← Back
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-1">Missions Accomplished</h1>
        <div className="text-center text-white/70 text-base mb-6">Real feedback from real clients.</div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={
                (filter === f.value
                  ? "bg-white/10 text-white border-white/20 "
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white ") +
                "px-4 py-1.5 rounded-full border font-bold text-sm transition focus:outline-none"
              }
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((review, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col"
            >
              <div className="flex flex-row items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold text-white">{review.name}</span>
                <span className="text-xs text-white/50">{review.location}</span>
                <span className="text-xs text-white/30 ml-auto">{review.date}</span>
              </div>
              <div className="flex flex-row items-center gap-2 mb-2">
                <span className="text-yellow-400 text-lg" aria-label="5 stars">★★★★★</span>
                <span
                  className={`px-2 py-0.5 rounded-full border text-xs font-bold ${getServiceColor(review.service)}`}
                >
                  {review.service}
                </span>
                <span
                  className="px-2.5 py-1 rounded-full border border-white/10 bg-white/10 text-xs text-white/80 font-semibold ml-1"
                  style={{ letterSpacing: 0.1 }}
                >
                  {review.identityLabel}
                </span>
              </div>
              <div className="text-white/90 text-[15px] mb-3">{review.text}</div>
              <div className="mt-auto text-xs text-white/40 font-medium">Verified Client</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
