"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const QUALIFIED_BULLETS = [
  "Real person who opted in and gave permission to be contacted",
  "Has a housing goal (buy/sell/rent/invest) in the next 12 months",
  "Completes the quick intake or responds to verification outreach",
  "Not a recent duplicate already in our system"
];

export default function PartnerSignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "ambassador";
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    licenseState: "",
    licenseNumber: "",
    brokerageName: "",
    confirmLicensed: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    // TODO: Implement actual submit logic
    setTimeout(() => {
      setLoading(false);
      router.push("/partner/signup?success=1");
    }, 1000);
  }

  if (type === "realtor") {
    return (
      <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          <img
            src="/homefront-badge.png"
            alt="HomeFront"
            className="w-64 h-auto mb-8 select-none pointer-events-none"
            draggable={false}
          />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-2">Realtor Partner Signup</h1>
          <div className="mb-4 text-center text-white/80">
            <div className="font-bold text-lg mb-1">$100 per qualified lead</div>
            <div className="text-base mt-1">Up to $5,000 per closed deal</div>
            <div className="text-xs text-white/60">You never pay for leads. We pay you when you close. No upfront cost. Fast payouts. Only real, motivated buyers and sellers.</div>
          </div>
          <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
            <div className="grid grid-cols-1 gap-4">
              <label className="block text-left">
                <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">First Name</span>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                  required
                />
              </label>
              <label className="block text-left">
                <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">Last Name</span>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                  required
                />
              </label>
              <label className="block text-left">
                <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">Phone</span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                  required
                />
              </label>
              <label className="block text-left">
                <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                  placeholder="Email (optional)"
                />
              </label>
              {/* Realtor-specific fields */}
              <label className="block text-left">
                <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">State Licensed In</span>
                <input
                  type="text"
                  name="licenseState"
                  value={form.licenseState}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                  required
                />
              </label>
              <label className="block text-left">
                <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">License Number</span>
                <input
                  type="text"
                  name="licenseNumber"
                  value={form.licenseNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                  required
                />
              </label>
              <label className="block text-left">
                <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">Brokerage Name</span>
                <input
                  type="text"
                  name="brokerageName"
                  value={form.brokerageName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                  required
                />
              </label>
              <label className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  name="confirmLicensed"
                  checked={form.confirmLicensed}
                  onChange={handleChange}
                  className="accent-[#ff385c] w-4 h-4"
                  required
                />
                <span className="text-xs text-white/80">I confirm I am a licensed real estate agent.</span>
              </label>
            </div>
            {error && <div className="text-red-400 text-sm mt-2 text-center">{error}</div>}
            <button
              type="submit"
              disabled={loading || !form.firstName || !form.lastName || !form.phone || !form.licenseState || !form.licenseNumber || !form.brokerageName || !form.confirmLicensed}
              className={["w-full mt-6 py-3 rounded-2xl font-extrabold text-lg shadow transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                loading || !form.firstName || !form.lastName || !form.phone || !form.licenseState || !form.licenseNumber || !form.brokerageName || !form.confirmLicensed
                  ? "bg-[#a81c3a] text-white/70 opacity-60 cursor-not-allowed"
                  : "bg-[#ff385c] text-white hover:bg-[#ff385c]/90",
              ].join(" ")}
            >
              {loading ? "Submitting..." : "Join as Realtor Partner"}
            </button>
            <div className="text-xs text-white/80 text-center mt-2">
              Takes 30 seconds. Partner dashboard access appears instantly.
            </div>
            <div className="text-xs text-white/60 text-center mt-2">
              By submitting, you confirm you are a licensed real estate agent and have permission to share this person’s contact info. Rewards are for verified marketing leads (not real-estate commissions). Terms/eligibility vary by state.
            </div>
            <div className="text-xs text-white/60 text-center mt-1 mb-2">
              FAQ: Is this a real-estate referral fee? No—payouts are for verified marketing leads/intros only, and you won’t perform licensed real-estate activity.
            </div>
            <div className="text-xs text-white/60 mt-2">Realtor partners may be pending verification.</div>
          </form>
        </div>
      </main>
    );
  }

  // Ambassador/other type
  return (
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <img
          src="/homefront-badge.png"
          alt="HomeFront"
          className="w-64 h-auto mb-8 select-none pointer-events-none"
          draggable={false}
        />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-2">Partner Signup</h1>
        <div className="mb-4 text-center text-white/80">
          <div className="font-bold text-lg mb-1">$100 per qualified lead</div>
          <div className="text-base mt-1">Up to $5,000 per closed deal</div>
          <div className="text-xs text-white/60">You never pay for leads. We pay you when you close. No upfront cost. Fast payouts. Only real, motivated buyers and sellers.</div>
        </div>
        <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
          <div className="grid grid-cols-1 gap-4">
            <label className="block text-left">
              <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">First Name</span>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                required
              />
            </label>
            <label className="block text-left">
              <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">Phone</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                required
              />
            </label>
          </div>
          {error && <div className="text-red-400 text-sm mt-2 text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading || !form.firstName || !form.phone}
            className={["w-full mt-6 py-3 rounded-2xl font-extrabold text-lg shadow transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
              loading || !form.firstName || !form.phone
                ? "bg-[#a81c3a] text-white/70 opacity-60 cursor-not-allowed"
                : "bg-[#ff385c] text-white hover:bg-[#ff385c]/90",
            ].join(" ")}
          >
            {loading ? "Submitting..." : "Create My QR Code"}
          </button>
          <div className="text-xs text-white/80 text-center mt-2">
            Takes 30 seconds. QR code appears instantly.
          </div>
          <div className="text-xs text-white/60 text-center mt-2">
            By submitting, you confirm you have permission to share this person’s contact info. Rewards are for verified marketing leads (not real-estate commissions). Terms/eligibility vary by state.
          </div>
          <div className="text-xs text-white/60 text-center mt-1 mb-2">
            FAQ: Is this a real-estate referral fee? No—payouts are for verified marketing leads/intros only, and you won’t perform licensed real-estate activity.
          </div>
        </form>
        <div className="mt-8 w-full bg-black/60 border border-white/10 rounded-xl p-4">
          <div className="font-bold text-base mb-2">What counts as a Qualified Lead</div>
          <ul className="list-disc list-inside text-white/80 text-sm mb-2">
            {QUALIFIED_BULLETS.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
          <div className="text-xs text-white/60">
            We verify to prevent spam and protect payouts.
          </div>
        </div>
      </div>
    </main>
  );
}

