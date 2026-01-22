"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const QUALIFIED_BULLETS = [
  "Real person with consent to be contacted",
  "Engages with a HomeFront partner",
  "Completes the initial qualification steps required to move forward",
];
const QUALIFIED_NOTE =
  "Qualification is confirmed through our standard verification process and may require completion of necessary intake, representation, and/or lender steps.";

export default function PartnerSignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  // Form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licenseState: "",
    licenseNumber: "",
    brokerageName: "",
    confirmLicensed: false,
    audienceFocus: "",
    shareChannel: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type: inputType, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: inputType === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload: any = {
      type,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
    };
    if (type === "realtor") {
      payload.licenseState = form.licenseState;
      payload.licenseNumber = form.licenseNumber;
      payload.brokerageName = form.brokerageName;
      payload.confirmLicensed = form.confirmLicensed;
    } else if (type === "ambassador") {
      if (form.audienceFocus) payload.audienceFocus = form.audienceFocus;
      if (form.shareChannel) payload.shareChannel = form.shareChannel;
    }
    try {
      const res = await fetch("/api/partner/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }
      router.replace("/partner/complete");
    } catch (e) {
      setError("Network error");
      setLoading(false);
    }
  }

  let header = "";
  let incentives = null;
  let extraFields = null;
  let note = null;
  if (type === "realtor") {
    header = "Realtor Partner Signup";
        incentives = (
          <div className="mb-4 text-center text-white/80">
            <div className="font-bold text-lg mb-1">$100 per qualified lead</div>
            <div className="text-base mt-1">Up to $5,000 per closed deal</div>
            <div className="text-xs text-white/60">You never pay for leads. We pay you when you close. No upfront cost. Fast payouts. Only real, motivated buyers and sellers.</div>
          </div>
        );

    header = "Realtor Partner Signup";
    incentives = (
      <div className="mb-4 text-center text-white/80">
        <div className="font-bold text-lg mb-1">$100 per qualified lead + Up to $5,000 per closed referral</div>
        <div className="text-xs text-white/60">Realtor partners may be pending verification.</div>
      </div>
    );
    extraFields = (
      <>
        <label className="block mt-4 text-left">
          <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">License State</span>
          <input
            type="text"
            name="licenseState"
            value={form.licenseState}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
            required
          />
        </label>
        <label className="block mt-4 text-left">
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
        <label className="block mt-4 text-left">
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
        <label className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            name="confirmLicensed"
            checked={form.confirmLicensed}
            onChange={handleChange}
            className="accent-[#ff385c] w-5 h-5"
            required
          />
          <span className="text-xs text-white/80">I confirm I am a currently licensed real estate agent.</span>
        </label>
      </>
    );
    note = <div className="text-xs text-white/60 mt-2">Realtor partners may be pending verification.</div>;
  } else if (type === "ambassador") {
    header = "Ambassador Partner Signup";
    incentives = (
      <div className="mb-4 text-center text-white/80">
        <div className="font-bold text-lg mb-1">$100 per qualified lead + $500 per closed transaction</div>
      </div>
    );
    // No extra required fields for ambassador
    extraFields = null;
  }

  if (!type) {
    return (
      <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          <img
            src="/homefront-badge.png"
            alt="HomeFront"
            className="w-64 h-auto mb-8 select-none pointer-events-none"
            draggable={false}
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2">Join the HomeFront Partner Program</h1>
          <p className="text-white/70 text-center mb-6">Are you a licensed real estate professional?</p>
          <blockquote className="italic text-white/80 text-center mb-8">“You bring the trust. We bring the expertise.”</blockquote>
          <div className="flex flex-col sm:flex-row gap-4 w-full mb-8">
            <button
              onClick={() => router.push("/partner/signup?type=realtor")}
              className="flex-1 py-4 rounded-2xl bg-white text-black font-extrabold text-lg shadow hover:bg-white/90 transition border border-white/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30"
            >
              Yes
            </button>
            <button
              onClick={() => router.push("/partner/signup?type=ambassador")}
              className="flex-1 py-4 rounded-2xl border border-white/15 bg-white/10 text-white font-extrabold text-lg hover:bg-white/15 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30"
            >
              No
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <img
          src="/homefront-badge.png"
          alt="HomeFront"
          className="w-64 h-auto mb-8 select-none pointer-events-none"
          draggable={false}
        />
        {/* Trust stack before form (CRO/UX) */}
        {type === "realtor" && (
          <div className="w-full flex flex-col items-center mb-4">
            <div className="text-xs text-white/70 text-center mb-1">Trusted by 1,000+ agents & clients</div>
            <div className="text-xs text-white/60 text-center mb-1">Your info is private and secure</div>
            <div className="text-xs text-white/60 text-center mb-1">How it works: We send you qualified leads. You only pay nothing—HomeFront pays you when you close.</div>
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-2">{header}</h1>
        {type === "realtor" ? (
          <div className="w-full flex flex-col items-center mb-4">
            <div className="mb-2 text-center text-white/80">
              <span className="font-bold text-lg block">Earn More, Close More</span>
              <span className="block text-base mt-1">$100 per qualified lead</span>
              <span className="block text-base">Up to $5,000 per closed referral</span>
            </div>
            <div className="w-16 border-t border-white/20 my-2"></div>
            <div className="text-xs text-white/60 text-center max-w-xs">Connect with motivated buyers and sellers. We verify every lead. No upfront cost. Fast payouts.</div>
          </div>
        ) : incentives}
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
            {/* Only require one contact method: email or phone */}
            <label className="block text-left">
              <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">Email (or Phone)</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50 mb-2"
                placeholder="Email (preferred)"
                required={!form.phone}
              />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
                placeholder="Phone (optional if email provided)"
                required={!form.email}
              />
            </label>
            {extraFields}
          </div>
          {error && <div className="text-red-400 text-sm mt-2 text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 rounded-2xl bg-[#ff385c] text-white font-extrabold text-lg shadow hover:bg-[#ff385c]/90 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        <div className="mt-8 w-full bg-black/60 border border-white/10 rounded-xl p-4">
          <div className="font-bold text-base mb-2">Qualified Lead</div>
          <ul className="list-disc list-inside text-white/80 text-sm mb-2">
            {QUALIFIED_BULLETS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="text-xs text-white/60">{QUALIFIED_NOTE}</div>
        </div>
      </div>
    </main>
  );
}

// (Removed any stray code after the export default function)

