"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import FlowLayout from "../../_components/FlowLayout";

export default function PartnerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // In production, verify against env variable or auth service
  // For MVP, using simple passcode check
  const PARTNER_PASSCODE = process.env.NEXT_PUBLIC_PARTNER_PASSCODE || "1775";
  const nextPath = searchParams.get("next") || "/partner/bulk-entry";

  const handleLogin = async () => {
    if (!passcode.trim()) return;

    setLoading(true);
    setError("");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (passcode.trim().toUpperCase() === PARTNER_PASSCODE) {
      // Store session
      if (typeof window !== "undefined") {
        sessionStorage.setItem("partner_authenticated", "true");
        sessionStorage.setItem("partner_login_time", new Date().toISOString());
      }

      router.push(nextPath);
    } else {
      setError("Invalid passcode. Please try again.");
      setLoading(false);
    }
  };

  return (
    <FlowLayout
      title={null}
      logoWidth={320}
      logoHeight={160}
      logoContainerClassName="mx-auto w-full max-w-[80vw] mt-10 pointer-events-none select-none"
      logoClassName="w-full h-auto scale-125 origin-center"
    >
      <div className="relative z-50 flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center pointer-events-none mt-8 mb-3">
          <h1 className="text-3xl font-extrabold tracking-tight leading-none text-white">
            Partner Portal
          </h1>
          <p className="mt-2 text-sm font-semibold text-white/70">
            Secure access for authorized partners.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-left">
          <label className="flex flex-col">
            <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">
              Partner Passcode
            </span>
            <input
              type="password"
              placeholder="Enter your passcode"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && passcode.trim()) {
                  handleLogin();
                }
              }}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15
                         text-white placeholder:text-white/40
                         focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
              autoFocus
            />
          </label>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <p className="text-xs text-white/50 mt-1 text-center">
            Contact your HomeFront representative if you need access.
          </p>
        </div>

        <button
          type="button"
          disabled={!passcode.trim() || loading}
          onClick={handleLogin}
          className={[
            "w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl text-[21px] font-extrabold transition",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
            "active:scale-[0.99]",
            passcode.trim() && !loading
              ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)] cursor-pointer"
              : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed",
          ].join(" ")}
        >
          {loading ? "Verifying..." : "Access Portal"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-1 text-[13px] font-bold text-[#ff385c] hover:text-[#ff667f] focus:outline-none"
        >
          Back to Home
        </button>
      </div>
    </FlowLayout>
  );
}
