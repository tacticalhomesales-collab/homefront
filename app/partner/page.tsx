

"use client";
import AppShell from "../../components/AppShell";

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
    <AppShell>
      <div className="w-full max-w-md mx-auto flex flex-col items-center px-4 pt-1 pb-6">
        <div className="flex flex-col items-center justify-center pointer-events-none mb-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-1 tracking-tight leading-tight">
            One Team. One Mission.
          </h1>
          <div className="text-sm sm:text-base text-white/80 text-center mb-0.5 font-semibold">
            Earn rewards when people you reach join HomeFront.
          </div>
          <div className="text-xs sm:text-sm text-white/60 text-center mb-3 font-medium">
            Built for community leaders and real estate pros.
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full mb-3">
          <button
            onClick={() => router.push("/partner/signup?type=ambassador")}
            className="w-full py-2.5 rounded-2xl bg-white text-black font-extrabold text-[14px] shadow border border-white/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30 text-center transition-colors duration-150 hover:bg-[#fff6f6] active:bg-[#ff385c] active:text-white"
            type="button"
          >
            <span className="block text-[15px] font-extrabold mb-0.5">Community Marketing Ambassador</span>
            <span className="block text-[11px] font-medium text-black/80">$100 for each Qualified Affiliate Signup tied to your code, up to $3,000/month.</span>
          </button>
          <button
            onClick={() => router.push("/partner/signup?type=realtor")}
            className="w-full py-2.5 rounded-2xl border border-white/15 bg-white/10 text-white font-extrabold text-[14px] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30 text-center transition-colors duration-150 hover:bg-[#fff6f6] hover:text-black active:bg-[#ff385c] active:text-white"
            type="button"
          >
            <span className="block text-[15px] font-extrabold mb-0.5">Partner Agent <span className="ml-2 text-[9px] font-bold text-[#ff385c] align-middle bg-white/10 px-1.5 py-0.5 rounded">Licensed agents only</span></span>
            <span className="block text-[11px] font-medium text-white/90">Earn up to 30% referral commission from our nationwide team on qualified closings; marketing rewards and performance bonuses are paid via your brokerage where required.</span>
          </button>
        </div>
        <div className="text-xs text-white/50 text-center mt-1">Not affiliated with any government agency.</div>
      </div>
    </AppShell>
  );
}
