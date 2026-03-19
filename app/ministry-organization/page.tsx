"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import AppShell from "../../components/AppShell";

export default function MinistryOrganizationPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const initialOrg = useMemo(() => sp.get("ministry_org") || "", [sp]);
  const initialRole = useMemo(() => sp.get("ministry_role") || "", [sp]);

  const [organization, setOrganization] = useState(initialOrg);
  const [role, setRole] = useState(initialRole);
  const [pressed, setPressed] = useState(false);
  const [active, setActive] = useState(false);

  const canContinue = organization.trim().length > 0 && role.trim().length > 0;

  const goNext = () => {
    if (pressed || !canContinue) return;

    const orgClean = organization.trim();
    const roleClean = role.trim();

    setActive(true);
    setPressed(true);

    setTimeout(() => {
      const q = new URLSearchParams();
      for (const [k, v] of sp.entries()) q.set(k, v);
      q.set("ministry_org", orgClean);
      q.set("ministry_role", roleClean);

      const nextPath = "/ministry-years";
      const fullUrl = `${nextPath}?${q.toString()}`;

      try {
        router.push(fullUrl);
      } finally {
        setTimeout(() => {
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.startsWith(nextPath)
          ) {
            window.location.assign(fullUrl);
          }
        }, 250);
      }
    }, 150);
  };

  return (
    <AppShell>
      <div className="w-full max-w-md mx-auto" style={{ marginTop: "-0.75rem" }}>
        <div className="flex flex-col items-center justify-center pointer-events-none mb-2 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight leading-none text-white mb-0.5">
            Ministry Details
          </h1>
          <p className="mt-1 text-xs font-semibold text-white/70">
            Tell us your organization and role.
          </p>
        </div>

        <div className="mt-2 relative z-50 space-y-3">
          <input
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            inputMode="text"
            placeholder="Organization (e.g., Church, Nonprofit)"
            className="w-full rounded-2xl px-4 py-2.5 border border-white/15 bg-white/10 text-white text-[15px] font-extrabold placeholder:text-white/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30"
          />
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            inputMode="text"
            placeholder="Your role (e.g., Pastor, Staff, Volunteer)"
            className="w-full rounded-2xl px-4 py-2.5 border border-white/15 bg-white/10 text-white text-[15px] font-extrabold placeholder:text-white/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30"
          />
        </div>

        <div className="mt-4 w-full">
          <button
            type="button"
            disabled={!canContinue || pressed}
            onClick={goNext}
            className={[
              "cursor-pointer pointer-events-auto block w-full py-2.5 rounded-xl text-[15px] font-extrabold transition active:scale-[0.99] select-none touch-manipulation focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
              !canContinue || pressed
                ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                : active
                ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]"
                : "border border-white/15 bg-white/10 text-white hover:bg-white/15 cursor-pointer",
            ].join(" ")}
          >
            Continue
          </button>
        </div>

        <p className="mt-5 text-[11px] text-white/45 text-center">
          Not affiliated with any government agency.
        </p>
      </div>
    </AppShell>
  );
}
