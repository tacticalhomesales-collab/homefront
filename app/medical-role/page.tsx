"use client";

import AppShell from "../../components/AppShell";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ROLES = [
  { label: "Nurse (RN / LVN)", value: "nurse" },
  { label: "Physician / PA / NP", value: "physician" },
  { label: "Allied Health (PT, OT, etc.)", value: "allied" },
  { label: "Support / Admin", value: "support_admin" },
  { label: "Other", value: "other" },
] as const;

export default function MedicalRolePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pressed, setPressed] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const goNext = (roleDetail: string) => {
    if (pressed) return;

    setPressed(true);
    setActive(roleDetail);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("medical_role_detail", roleDetail);

    const nextPath = "/medical-years";
    const url = `${nextPath}?${q.toString()}`;

    setTimeout(() => {
      try {
        router.push(url);
      } finally {
        setTimeout(() => {
          if (typeof window !== "undefined" && !window.location.pathname.startsWith(nextPath)) {
            window.location.assign(url);
          }
        }, 250);
      }
    }, 120);
  };

  return (
    <AppShell>
      <div className="w-full max-w-md mx-auto flex flex-col items-center pt-1" style={{ marginTop: "-0.5rem" }}>
        <div className="w-full flex flex-col items-center text-center pointer-events-none">
          <h1 className="text-xl font-extrabold tracking-tight leading-none text-white mb-1">
            Medical Role
          </h1>
          <p className="text-sm font-semibold text-white/80">
            What best describes your role?
          </p>
        </div>
        <div className="w-full flex flex-col gap-1.5 mt-1 items-center">
          {ROLES.map((r) => {
            const isActive = active === r.value;
            return (
              <div key={r.value} className="w-full max-w-xs">
                <button
                  type="button"
                  disabled={pressed}
                  onClick={() => goNext(r.value)}
                  className={[
                    "cursor-pointer pointer-events-auto block w-full py-1 rounded-xl",
                    "text-sm font-extrabold active:scale-[0.99] transition",
                    "select-none touch-manipulation",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30",
                    isActive
                      ? "bg-[#ff385c] text-white shadow-[0_6px_18px_rgba(255,56,92,0.18)] cursor-not-allowed"
                      : pressed
                      ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                      : "border border-white/15 bg-white/10 text-white hover:bg-white/15",
                  ].join(" ")}
                  style={{ fontSize: "clamp(12px,2.4vw,14px)" }}
                >
                  {r.label}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
