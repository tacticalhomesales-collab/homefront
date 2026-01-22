
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PartnerEntryPage() {
  const router = useRouter();

  // Cookie redirect logic (unchanged)
  useEffect(() => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";").map((c) => c.trim());
      const hasPartner = cookies.some((c) => c.startsWith("hf_partner="));
      if (hasPartner) {

        router.replace("/partner/dashboard");
      }
    }
  }, [router]);

  return (
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <img
          src="/homefront-logo.png"
          alt="HomeFront – Smart Moves. Strong Homes."
          className="w-80 h-auto mb-8 select-none pointer-events-none drop-shadow-xl"
          draggable={false}
        />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2 tracking-tight leading-tight">
          Become a HomeFront Partner
        </h1>
        <div className="text-base sm:text-lg text-white/80 text-center mb-2 font-semibold">
          Earn cash for every referral. Agents earn more.
        </div>
        <div className="text-sm sm:text-base text-white/60 text-center mb-6 font-medium">
          Trusted by real estate pros nationwide.
        </div>
        <div className="flex flex-col gap-5 w-full mb-8">
          <button
            onClick={() => router.push("/partner/signup?type=ambassador")}
            className="w-full py-5 rounded-2xl bg-white text-black font-extrabold text-lg shadow border border-white/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30 text-center transition-colors duration-150 hover:bg-[#fff6f6] active:bg-[#ff385c] active:text-white"
            type="button"
          >
            <span className="block text-xl font-extrabold mb-1">Community Ambassador</span>
            <span className="block text-base font-medium text-black/80">$100 per qualified lead + $500 per closed transaction</span>
          </button>
          <button
            onClick={() => router.push("/partner/signup?type=realtor")}
            className="w-full py-5 rounded-2xl border border-white/15 bg-white/10 text-white font-extrabold text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30 text-center transition-colors duration-150 hover:bg-[#fff6f6] hover:text-black active:bg-[#ff385c] active:text-white"
            type="button"
          >
            <span className="block text-xl font-extrabold mb-1">Partner Agent <span className="ml-2 text-xs font-bold text-[#ff385c] align-middle bg-white/10 px-2 py-1 rounded">Licensed agents only</span></span>
            <span className="block text-base font-medium text-white/90">$100 per qualified lead + Up to $5,000 per closed referral</span>
          </button>
        </div>
        <div className="text-xs text-white/50 text-center mt-2">Not affiliated with any government agency.</div>
      </div>
    </main>
  );
}
