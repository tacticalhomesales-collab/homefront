"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
  const [tab, setTab] = useState<'single' | 'bulk'>('single');
  // Single referral state
  const [friendName, setFriendName] = useState("");
  const [friendPhone, setFriendPhone] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [friendLocation, setFriendLocation] = useState("");
  const [mission, setMission] = useState("");
  const [pressed, setPressed] = useState(false);
  const canContinue = friendName.trim() && friendPhone.trim() && mission;
  const handleContinue = () => {
    if (!canContinue || pressed) return;
    setPressed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "referral_friend",
        JSON.stringify({
          name: friendName.trim(),
          phone: friendPhone.trim(),
          email: friendEmail.trim(),
          location: friendLocation.trim(),
        })
      );
    }
    const q = new URLSearchParams();
    q.set("mission", mission);
    q.set("mode", "referral");
    setTimeout(() => router.push(`/refer-timeline?${q.toString()}`), 120);
  };
  const MissionButton = ({ label, value }: { label: string; value: string }) => {
    const isActive = mission === value;
    return (
      <button
        type="button"
        onClick={() => setMission(value)}
        className={[
          "cursor-pointer pointer-events-auto block w-full py-3 rounded-xl",
          "text-[16px] font-extrabold active:scale-[0.99] transition",
          "select-none touch-manipulation",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
          isActive
            ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]"
            : "border border-white/15 bg-white/10 text-white hover:bg-white/15",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  return (
    <AppShell>
      <div className="w-full max-w-md relative mx-auto text-left px-4 pt-8 pb-10 flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center pointer-events-none mb-5 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight leading-none">Referral</h1>
          <p className="mt-3 text-sm font-semibold text-white/70">
            Invite others to HomeFront:
          </p>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            className={`flex-1 py-2 rounded-xl font-bold transition text-sm ${tab === 'single' ? 'bg-[#ff385c] text-white shadow' : 'bg-white/10 text-white/60 hover:bg-white/15'}`}
            onClick={() => setTab('single')}
            type="button"
          >
            Single Referral
          </button>
          <button
            className={`flex-1 py-2 rounded-xl font-bold transition text-sm ${tab === 'bulk' ? 'bg-[#ff385c] text-white shadow' : 'bg-white/10 text-white/60 hover:bg-white/15'}`}
            onClick={() => setTab('bulk')}
            type="button"
          >
            Bulk Referrals
          </button>
        </div>
        {/* Tab Content */}
        {tab === 'single' ? (
          <div className="relative z-50 flex flex-col gap-4">
            {/* Friend Info */}
            <div className="flex flex-col gap-3 text-left">
              <label className="flex flex-col">
                <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">Name</span>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">Phone</span>
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={friendPhone}
                  onChange={(e) => setFriendPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">Email <span className="text-white/40">(Optional)</span></span>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                />
              </label>
                <label className="flex flex-col">
                  <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">Client's Location</span>
                  <input
                    type="text"
                    placeholder="City, State or Base"
                    value={friendLocation}
                    onChange={(e) => setFriendLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                  />
                </label>
            </div>
            {/* Mission Selection */}
            <div className="flex flex-col gap-2 text-left mt-2">
              <span className="text-xs font-bold text-white/70 uppercase tracking-wide">Mission</span>
              <div className="grid grid-cols-2 gap-2">
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
              className={["w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl text-[21px] font-extrabold transition","focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30","active:scale-[0.99]",canContinue && !pressed? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)] cursor-pointer":"bg-white/5 border border-white/10 text-white/40 cursor-not-allowed",].join(" ")}
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
