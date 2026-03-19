"use client";

import { useMemo, useRef, useState, useEffect, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppShell from "../../components/AppShell";

type VerifyStage = "idle" | "verifying" | "verified";

function CheckboxRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex items-start gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <span
        className="shrink-0 w-4 h-4 rounded border border-white/30 bg-white/5 flex items-center justify-center
                   transition-colors duration-150 peer-checked:bg-[#ff385c] peer-checked:border-[#ff385c]
                   peer-focus-visible:ring-2 peer-focus-visible:ring-[#ff385c]/50"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 20 20"
          className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 10.5l3.2 3.2L16 5.9" />
        </svg>
      </span>
      <span className="text-[10px] font-semibold text-white/75 leading-snug">{children}</span>
    </label>
  );
}

export default function ContactPage() {
  const sp = useSearchParams();
  const didNavigate = useRef(false);

  const [verifyStage, setVerifyStage] = useState<VerifyStage>("idle");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); // optional
  const [notes, setNotes] = useState("");
  const [refCode, setRefCode] = useState<string | null>(null);
  const [consentAll, setConsentAll] = useState(false);

  const baseParams = useMemo(() => {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    return q;
  }, [sp]);

  // Capture partner referral code from query or localStorage for lead attribution
  useEffect(() => {
    const fromUrl = sp.get("ref");
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
  }, [sp]);

  const cleanPhone = (raw: string) => raw.replace(/[^\d]/g, "").slice(0, 15);

  const formatPhone = (raw: string) => {
    const digits = cleanPhone(raw);
    // US-friendly formatting for up to 10 digits; otherwise just return digits
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    if (digits.length <= 10)
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    return digits;
  };

  const isValid = useMemo(() => {
    const nameOk = fullName.trim().length >= 2;
    const digits = cleanPhone(phone);
    const phoneOk = digits.length >= 10; // require 10 digits
    return nameOk && phoneOk;
  }, [fullName, phone]);

  const canSubmit = isValid && consentAll;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (didNavigate.current) return;
    didNavigate.current = true;

    // Start verification overlay once the user confirms their contact info
    setVerifyStage("verifying");

    // First, attempt to create a lead in Supabase
    try {
      const journey = Object.fromEntries(baseParams.entries());
      const leadPayload = {
        lead_name: fullName.trim(),
        lead_phone: cleanPhone(phone),
        lead_email: email.trim() || undefined,
        ref_code: refCode ?? undefined,
        journey: {
          ...journey,
          source: "contact",
          notes: notes.trim() || undefined,
          consent_contact: "1",
          consent_terms: "1",
        },
      };

      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload),
      });
    } catch (err) {
      console.error("[ContactPage] Lead submission failed", err);
      // We still continue to confirmation so the UX is not blocked.
    }

    const q = new URLSearchParams(baseParams.toString());
    q.set("name", fullName.trim());
    q.set("phone", cleanPhone(phone));

    if (email.trim()) q.set("email", email.trim());
    if (notes.trim()) q.set("notes", notes.trim());
    q.set("consent_contact", "1");
    q.set("consent_terms", "1");

    // After a brief verification animation, go to final confirmation
    const nextUrl = `/confirmation?${q.toString()}`;
    setVerifyStage("verified");
    setTimeout(() => {
      window.location.assign(nextUrl);
    }, 900);
  };

  return (
    <AppShell>
      {verifyStage !== "idle" && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center">
          <div className="text-center">
            {verifyStage === "verifying" && (
              <div className="flex flex-col items-center gap-4">
                <svg
                  className="animate-spin h-[120px] w-[120px] text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-lg font-semibold text-white">Verifying...</p>
              </div>
            )}
            {verifyStage === "verified" && (
              <div className="flex flex-col items-center gap-4">
                <svg
                  className="h-[120px] w-[120px] text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="white"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 13l3 3 7-7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="none"
                  />
                </svg>
                <p className="text-2xl font-bold text-green-400 mt-2">Verified</p>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="w-full max-w-xs mx-auto flex flex-col items-center pt-0 mt-0" style={{ marginTop: "0" }}>
        <h1 className="text-[20px] font-extrabold text-center mb-[2px]">Contact Info</h1>
        <div className="text-[14px] text-white/80 text-center mb-[4px] font-semibold">Where should we send your free HomeFront consultation and next steps?</div>
        <form onSubmit={onSubmit} className="w-full mt-0 text-left relative z-50">
          <label className="block mt-[2px]">
            <span className="block text-[10px] font-extrabold tracking-wide text-white/70">NAME</span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              className="mt-[2px] w-full rounded px-[8px] py-[7px] text-[11px] font-semibold bg-white/10 border border-white/15 text-white placeholder:text-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30"
              placeholder="First & last"
            />
          </label>
          <label className="block mt-[2px]">
            <span className="block text-[10px] font-extrabold tracking-wide text-white/70">PHONE NUMBER</span>
            <input
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              inputMode="tel"
              autoComplete="tel"
              className="mt-[2px] w-full rounded px-[8px] py-[7px] text-[11px] font-semibold bg-white/10 border border-white/15 text-white placeholder:text-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30"
              placeholder="(555) 555-5555"
            />
          </label>
          <label className="block mt-[2px]">
            <span className="block text-[10px] font-extrabold tracking-wide text-white/70">EMAIL</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputMode="email"
              autoComplete="email"
              className="mt-[2px] w-full rounded px-[8px] py-[7px] text-[11px] font-semibold bg-white/10 border border-white/15 text-white placeholder:text-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30"
              placeholder="name@email.com"
            />
          </label>
          <label className="block mt-[2px]">
            <span className="block text-[10px] font-extrabold tracking-wide text-white/70">NOTES (OPTIONAL)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={1}
              className="mt-[2px] w-full rounded px-[8px] py-[7px] text-[11px] font-semibold bg-white/10 border border-white/15 text-white placeholder:text-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30"
              placeholder="Anything we should know?"
            />
          </label>
          <div className="mt-[6px] space-y-2">
            <CheckboxRow checked={consentAll} onChange={setConsentAll}>
              I agree to be contacted by HomeFront.
              <br />
              I accept the {""}
              <Link
                href={`/terms?${baseParams.toString()}`}
                className="text-[#ff385c] underline font-extrabold"
              >
                terms and conditions
              </Link>
              .
            </CheckboxRow>
          </div>
          <button
            type="submit"
            disabled={!canSubmit}
            className={[
              "mt-[6px] block w-full py-[7px] rounded text-[13px] font-extrabold transition active:scale-[0.99]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30",
              canSubmit
                ? "bg-[#ff385c] text-white shadow-[0_1px_2px_rgba(255,56,92,0.18)]"
                : "bg-white/10 border border-white/15 text-white/40 cursor-not-allowed",
            ].join(" ")}
          >
            Continue
          </button>
          <p className="mt-[5px] text-[8px] text-white/45 text-center">Not affiliated with any government agency.</p>
        </form>
      </div>
    </AppShell>
  );
}
