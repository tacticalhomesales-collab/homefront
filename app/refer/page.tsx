"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "../../components/AppShell";
import BulkReferralForm from "./BulkReferralForm";

const MISSIONS = [
  { label: "Buy", value: "buy" },
  { label: "Sell", value: "sell" },
  { label: "Rent", value: "rent" },
  { label: "Manage Rental", value: "manage_rental" },
];

export default function ReferPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'single' | 'bulk'>('single');
  // Single referral state
  const [friendName, setFriendName] = useState("");
  const [friendPhone, setFriendPhone] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [friendLocation, setFriendLocation] = useState("");
  const [mission, setMission] = useState("");
  const [refCode, setRefCode] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);

  // Resolve partner referral code from URL or localStorage for lead attribution
  useEffect(() => {
    const fromUrl = searchParams.get("ref");
    if (fromUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRefCode(fromUrl);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("hf_partner_public_code", fromUrl);
        } catch {}
      }
      return;
    }

    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem("hf_partner_public_code");
        if (stored) setRefCode(stored);
      } catch {}
    }
  }, [searchParams]);
  const canContinue = friendName.trim() && friendPhone.trim() && mission;
  const handleContinue = () => {
    if (!canContinue || pressed) return;
    setPressed(true);
    const consentedAt = new Date().toISOString();
    const leadData = {
      lead_name: friendName.trim(),
      lead_phone: friendPhone.trim(),
      lead_email: friendEmail.trim(),
      ref_code: refCode ?? undefined,
      journey: {
        mission,
        friend_location: friendLocation.trim() || undefined,
        source: "refer_single",
        mode: "referral",
        consented_at: consentedAt,
      },
    };
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Submission failed");
        return res.json();
      })
      .then(() => {
        // Lead is fully captured; go straight to referral thank-you.
        router.push("/refer-confirmation");
      })
      .catch(() => {
        setPressed(false);
        alert("Submission failed. Please try again.");
      });
  };
  const MissionButton = ({ label, value }: { label: string; value: string }) => {
    const isActive = mission === value;
    return (
      <button
        type="button"
        onClick={() => setMission(value)}
        className={[
          "cursor-pointer pointer-events-auto block w-full px-1.5 py-0.5 rounded-xl",
          "text-[10px] font-extrabold active:scale-[0.99] transition text-center",
          "select-none touch-manipulation",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/40",
          isActive
            ? "border border-[#ff385c] bg-[#ff385c]/20 text-white shadow-[0_0_0_1px_rgba(255,56,92,0.4)]"
            : "border border-white/15 bg-white/5 text-white/80 hover:bg-white/10",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  return (
    <AppShell>
      <div className="w-full max-w-sm relative mx-auto text-left px-3 pt-1 pb-3 flex flex-col gap-2">
        <div className="flex flex-col items-center justify-center pointer-events-none mb-1 text-center">
          <h1 className="text-[20px] font-extrabold tracking-tight leading-none">Referral</h1>
          <p className="mt-0.5 text-[12px] font-semibold text-white/70">
            Invite others to HomeFront:
          </p>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 mb-2">
          <button
            className={`flex-1 py-0.5 rounded-xl font-bold transition text-[10px] ${tab === 'single' ? 'bg-[#ff385c] text-white shadow' : 'bg-white/10 text-white/60 hover:bg-white/15'}`}
            onClick={() => setTab('single')}
            type="button"
          >
            Single Referral
          </button>
          <button
            className={`flex-1 py-0.5 rounded-xl font-bold transition text-[10px] ${tab === 'bulk' ? 'bg-[#ff385c] text-white shadow' : 'bg-white/10 text-white/60 hover:bg-white/15'}`}
            onClick={() => setTab('bulk')}
            type="button"
          >
            Bulk Referrals
          </button>
        </div>
        {/* Tab Content */}
        {tab === 'single' ? (
          <div className="relative z-50 flex flex-col gap-2">
            {/* Friend Info */}
            <div className="flex flex-col gap-1 text-left">
              <label className="flex flex-col">
                <span className="text-[9px] font-bold text-white/70 uppercase tracking-wide mb-0.5">Name</span>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  className="w-full px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-[9px] font-bold text-white/70 uppercase tracking-wide mb-0.5">Phone</span>
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={friendPhone}
                  onChange={(e) => setFriendPhone(e.target.value)}
                  className="w-full px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-[9px] font-bold text-white/70 uppercase tracking-wide mb-0.5">Email <span className="text-white/40">(Optional)</span></span>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  className="w-full px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                />
              </label>
                <label className="flex flex-col">
                  <span className="text-[9px] font-bold text-white/70 uppercase tracking-wide mb-0.5">Location</span>
                  <input
                    type="text"
                    placeholder="City, State or Base"
                    value={friendLocation}
                    onChange={(e) => setFriendLocation(e.target.value)}
                    className="w-full px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                  />
                </label>
            </div>
            {/* Mission Selection */}
            <div className="flex flex-col gap-0.5 text-left mt-0.5">
              <span className="text-[9px] font-bold text-white/70 uppercase tracking-wide">Mission</span>
              <div className="grid grid-cols-2 gap-1">
                {MISSIONS.map((m) => (
                  <MissionButton key={m.value} {...m} />
                ))}
              </div>
            </div>
            {/* Continue */}
            <button
              type="button"
              disabled={!canContinue || pressed}
              onClick={handleContinue}
              className={[
                "mt-0.5 w-full py-1 rounded-xl text-[12px] font-extrabold transition",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                "active:scale-[0.99]",
                canContinue && !pressed
                  ? "bg-[#ff385c] text-white shadow-[0_6px_18px_rgba(255,56,92,0.22)] cursor-pointer"
                  : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed",
              ].join(" ")}
            >
              Continue
            </button>
          </div>
        ) : (
          <BulkReferralForm />
        )}
      </div>
    </AppShell>
  );
}
