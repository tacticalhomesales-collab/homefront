"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import FlowLayout from "../../_components/FlowLayout";

export default function PartnerLoginPage() {
  const router = useRouter();

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // In production, verify against env variable or auth service
  // For MVP, using simple passcode check
  const PARTNER_PASSCODE = process.env.NEXT_PUBLIC_PARTNER_PASSCODE || "HOMEFRONT2026";

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

      router.push("/partner/bulk-entry");
    } else {
      setError("Invalid passcode. Please try again.");
      setLoading(false);
    }
  };

  return (
    <FlowLayout title="Partner Portal" subtitle="Secure access for authorized partners.">
      <div className="relative z-50 flex flex-col gap-4">
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

          <p className="text-xs text-white/50 mt-1">
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
          className="w-[calc(100%+2.5rem)] -mx-5 py-3 rounded-2xl
                     border border-white/15 bg-white/10 text-white text-[16px] font-extrabold
                     hover:bg-white/15 active:scale-[0.99] transition
                     focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
        >
          Back to Home
        </button>
      </div>
    </FlowLayout>
  );
}
