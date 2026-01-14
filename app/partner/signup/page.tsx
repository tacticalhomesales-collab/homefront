"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import FlowLayout from "../../_components/FlowLayout";

export default function PartnerSignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit =
    firstName.trim() &&
    lastName.trim() &&
    (phone.trim() || email.trim());

  const handleSignup = async () => {
    if (!canSubmit || loading) return;

    setLoading(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate partner code
    const publicCode = generatePartnerCode();

    // Store partner data
    const partner = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      contact: phone.trim() || email.trim(),
      public_code: publicCode,
      created_at: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("hf_partner", JSON.stringify(partner));
      localStorage.setItem("hf_partner_public_code", publicCode);
    }

    router.push("/partner/dashboard");
  };

  return (
    <FlowLayout title="Partner Signup" subtitle="Create your unique referral QR code">
      <div className="relative z-50 flex flex-col gap-4">
        <div className="flex flex-col gap-3 text-left">
          <label className="flex flex-col">
            <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">
              First Name *
            </span>
            <input
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15
                         text-white placeholder:text-white/40
                         focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
              autoFocus
            />
          </label>

          <label className="flex flex-col">
            <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">
              Last Name *
            </span>
            <input
              type="text"
              placeholder="Smith"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15
                         text-white placeholder:text-white/40
                         focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">
              Phone Number *
            </span>
            <input
              type="tel"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15
                         text-white placeholder:text-white/40
                         focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
            />
          </label>

          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 h-px bg-white/15" />
            <span className="text-xs text-white/40 font-semibold">OR</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          <label className="flex flex-col">
            <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">
              Email Address
            </span>
            <input
              type="email"
              placeholder="partner@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15
                         text-white placeholder:text-white/40
                         focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
            />
          </label>

          <p className="text-xs text-white/50 mt-1">
            * Phone or email required. This creates your unique referral code.
          </p>
        </div>

        <button
          type="button"
          disabled={!canSubmit || loading}
          onClick={handleSignup}
          className={[
            "w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl text-[21px] font-extrabold transition",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
            "active:scale-[0.99]",
            canSubmit && !loading
              ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)] cursor-pointer"
              : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed",
          ].join(" ")}
        >
          {loading ? "Creating..." : "Create Partner QR"}
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

function generatePartnerCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
