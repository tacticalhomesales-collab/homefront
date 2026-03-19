"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef } from "react";
import AddToHomeScreen from "../../_components/AddToHomeScreen";

const VERIFIED_SIGNUP_BULLETS = [
  "A new household joins HomeFront using your link or QR code",
  "They complete a quick intake so we can understand their housing goals",
  "They get prequalified by a participating lender",
  "They sign a buyer-broker agreement with a participating agent",
  "They are not already active in our system under the same phone or email",
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
    referredBy: "",
    licenseState: "",
    licenseNumber: "",
    brokerageName: "",
    confirmLicensed: false,
    confirmOwnInfo: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showA2HS, setShowA2HS] = useState(false);
  const hasRedirectedRef = useRef(false);

  function handleAfterPrompt() {
    setShowA2HS(false);
    if (hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;
    router.push("/share");
  }

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
    try {
      // If this browser already has a personal user code from the
      // main funnel, promote that code to the permanent partner code
      // so it stays consistent when they join the portal.
      let existingUserCode: string | null = null;
      if (typeof window !== "undefined") {
        try {
          existingUserCode = window.localStorage.getItem("hf_user_code");
        } catch {
          existingUserCode = null;
        }
      }

      const payload = {
        ...form,
        type,
        refCode: existingUserCode || undefined,
      };
      const response = await fetch("/api/partner/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || errorData.message || "Submission failed.");
        setLoading(false);
        return;
      }

      const result = await response.json();
      const refCode = result?.ref_code || result?.partner?.ref_code;
      if (typeof window !== "undefined" && refCode) {
        // Persist the partner's public referral code so Share/QR uses it
        try {
          window.localStorage.setItem("hf_partner_public_code", refCode);
        } catch {}
      }

      setLoading(false);
      // After signup, show Add to Home Screen prompt before sending them to Share
      setShowA2HS(true);
    } catch (err) {
      setError("Submission failed. Please try again.");
      setLoading(false);
    }
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-3">Realtor Partner Signup</h1>
          <div className="mb-5 text-center text-white/80">
            <div className="font-bold text-lg mb-1">
              Earn up to 30% referral commission from our nationwide team
            </div>
            <div className="text-base mt-2">
              HomeFront tracks and works leads on your behalf.
            </div>
          </div>
          <div className="w-full mb-3 text-xs sm:text-sm text-white/70">
            <div className="font-semibold mb-1 text-center uppercase tracking-wide text-white/60">How it works</div>
            <ul className="list-disc list-inside space-y-1">
              <li>Use the <span className="font-semibold">Share</span> tab to grab your link and QR code.</li>
              <li>Tap the <span className="font-semibold">HomeFront</span> logo for instant access to your QR code.</li>
              <li>Have households scan or tap; HomeFront tracks signups for you.</li>
            </ul>
          </div>
          <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
            <div className="grid grid-cols-1 gap-2.5">
              <label className="block text-left space-y-0.5">
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide">First Name</span>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                  required
                />
              </label>
              <label className="block text-left space-y-0.5">
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide">Last Name</span>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                  required
                />
              </label>
              <label className="block text-left space-y-0.5">
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide">Phone</span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                  required
                />
              </label>
              <label className="block text-left space-y-0.5">
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide">Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                  placeholder="Work email"
                  required
                />
              </label>
              <label className="block text-left space-y-0.5">
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide">Referred by <span className="text-white/40">(optional)</span></span>
                <input
                  type="text"
                  name="referredBy"
                  value={form.referredBy}
                  onChange={handleChange}
                  className="w-full px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                  placeholder="Who told you about HomeFront?"
                />
              </label>
              {/* Realtor-specific fields */}
              <label className="block text-left space-y-0.5">
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide">State Licensed In</span>
                <input
                  type="text"
                  name="licenseState"
                  value={form.licenseState}
                  onChange={handleChange}
                  className="w-full px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                  required
                />
              </label>
              <label className="block text-left space-y-0.5">
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide">License Number</span>
                <input
                  type="text"
                  name="licenseNumber"
                  value={form.licenseNumber}
                  onChange={handleChange}
                  className="w-full px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                  required
                />
              </label>
              <label className="block text-left space-y-0.5">
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide">Brokerage Name</span>
                <input
                  type="text"
                  name="brokerageName"
                  value={form.brokerageName}
                  onChange={handleChange}
                  className="w-full px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
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
              disabled={loading || !form.firstName || !form.lastName || !form.phone || !form.email || !form.licenseState || !form.licenseNumber || !form.brokerageName || !form.confirmLicensed}
              className={[
                "w-full mt-4 py-2.5 rounded-2xl font-extrabold text-[15px] shadow transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                loading || !form.firstName || !form.lastName || !form.phone || !form.email || !form.licenseState || !form.licenseNumber || !form.brokerageName || !form.confirmLicensed
                  ? "bg-[#a81c3a] text-white/70 opacity-60 cursor-not-allowed"
                  : "bg-[#ff385c] text-white hover:bg-[#ff385c]/90",
              ].join(" ")}
            >
              {loading ? "Submitting..." : "Join as Realtor Partner"}
            </button>
            <div className="text-xs text-white/80 text-center mt-2">
              Takes 30 seconds. Partner dashboard access appears instantly.
            </div>
            <div className="text-xs text-white/60 text-center mt-1">
              After you enroll, the Share tab and the HomeFront logo on the homepage will always open your personal QR code so you can share it quickly.
            </div>
            <div className="text-xs text-white/60 text-center mt-2">
              By submitting, you confirm you are a licensed real estate agent and that the contact information you provided is your own. Rewards are based on Qualified Affiliate Signups, which occur only after a household joins through your code, gets prequalified by a participating lender, and signs a buyer-broker agreement with a participating agent. Rewards do not depend on whether anyone buys or sells a home. Program structure and eligibility may vary by market and brokerage.
            </div>
            <div className="text-xs text-white/60 text-center mt-1 mb-2">
              FAQ: Is this a closing-based real-estate payout? No—rewards are marketing and education incentives only, separate from any compensation related to buying or selling a home.
            </div>
            <div className="text-xs text-white/60 mt-1 text-center">
              Any marketing rewards and performance bonuses are paid through your brokerage where required.
            </div>
            <div className="text-xs text-white/60 mt-1">Realtor partners may be pending verification.</div>
          </form>
        </div>
        <AddToHomeScreen
          isOpen={showA2HS}
          onClose={handleAfterPrompt}
          onComplete={handleAfterPrompt}
        />
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-2">Marketing Ambassador</h1>
        <div className="mb-4 text-center text-white/80">
          <div className="font-bold text-lg mb-1">Earn $100 for each Qualified Affiliate Signup</div>
          <div className="text-base mt-1">Help households discover HomeFront and share your HomeFront QR code.</div>
        </div>
        <div className="w-full mb-3 text-xs sm:text-sm text-white/70">
          <div className="font-semibold mb-1 text-center uppercase tracking-wide text-white/60">How it works</div>
          <ul className="list-disc list-inside space-y-1">
            <li>Open the <span className="font-semibold">Share</span> tab to see your link and QR code.</li>
            <li>Tap the <span className="font-semibold">HomeFront</span> logo for instant access to your QR code.</li>
            <li>Friends scan or tap; HomeFront takes it from there.</li>
          </ul>
        </div>
        <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
          <div className="grid grid-cols-1 gap-2.5">
            <label className="block text-left space-y-0.5">
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide">First Name</span>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                required
              />
            </label>
            <label className="block text-left space-y-0.5">
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide">Last Name</span>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                required
              />
            </label>
            <label className="block text-left space-y-0.5">
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide">Phone</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                required
              />
            </label>
            <label className="block text-left space-y-0.5">
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                placeholder="Email for updates about your rewards"
                required
              />
            </label>
            <label className="block text-left space-y-0.5">
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide">How did you hear about HomeFront? <span className="text-white/40">(optional)</span></span>
              <input
                type="text"
                name="referredBy"
                value={form.referredBy}
                onChange={handleChange}
                className="w-full px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                placeholder="Friend, social media, event, etc."
              />
            </label>
            <label className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                name="confirmOwnInfo"
                checked={form.confirmOwnInfo}
                onChange={handleChange}
                className="accent-[#ff385c] w-4 h-4"
                required
              />
              <span className="text-xs text-white/80">I am entering my own contact information (not someone else’s).</span>
            </label>
          </div>
          {error && <div className="text-red-400 text-sm mt-2 text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading || !form.firstName || !form.lastName || !form.phone || !form.email || !form.confirmOwnInfo}
            className={[
              "w-full mt-4 py-2.5 rounded-2xl font-extrabold text-[15px] shadow transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
              loading || !form.firstName || !form.lastName || !form.phone || !form.email || !form.confirmOwnInfo
                ? "bg-[#a81c3a] text-white/70 opacity-60 cursor-not-allowed"
                : "bg-[#ff385c] text-white hover:bg-[#ff385c]/90",
            ].join(" ")}
          >
            {loading ? "Submitting..." : "Create My QR Code"}
          </button>
          <div className="text-xs text-white/80 text-center mt-2">
            Takes 30 seconds. QR code appears instantly.
          </div>
          <div className="text-xs text-white/60 text-center mt-1">
            After you enroll, the Share tab and the HomeFront logo on the homepage will always open your personal QR code so you can share it any time.
          </div>
          <div className="text-xs text-white/60 text-center mt-2">
            Use your own mobile number so we can text you your code. Do not enter anyone else’s contact information. Rewards are for Qualified Affiliate Signups only, which occur after a household joins through your code, gets prequalified by a participating lender, and signs a buyer-broker agreement with a participating agent. Rewards may be capped at $3,000 per month per ambassador and are not based on whether anyone buys or sells a home. Message and data rates may apply. You can opt out anytime.
          </div>
          <div className="text-xs text-white/60 text-center mt-1 mb-2">
            FAQ: Is this a real-estate payout for closings? No—rewards are marketing and education incentives only and stay separate from any compensation related to buying or selling a home.
          </div>
        </form>
        <div className="mt-8 w-full bg-black/60 border border-white/10 rounded-xl p-4">
          <div className="font-bold text-base mb-2">What counts as a Qualified Affiliate Signup</div>
          <ul className="list-disc list-inside text-white/80 text-sm mb-2">
            {VERIFIED_SIGNUP_BULLETS.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
          <div className="text-xs text-white/60">
            We verify each signup to prevent spam and protect the integrity of the program.
          </div>
        </div>
      </div>
      <AddToHomeScreen
        isOpen={showA2HS}
        onClose={handleAfterPrompt}
        onComplete={handleAfterPrompt}
      />
    </main>
  );
}

