"use client";


import { useMemo, useRef, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AppShell from "../../components/AppShell";

export default function ContactPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const didNavigate = useRef(false);

  // Guard: redirect to consent if not verified or consented
  useEffect(() => {
    const verified = sp.get("verified");
    const consentContact = sp.get("consent_contact");
    const consentTerms = sp.get("consent_terms");

    if (verified !== "1" || consentContact !== "1" || consentTerms !== "1") {
      const q = new URLSearchParams();
      for (const [k, v] of sp.entries()) q.set(k, v);
      const url = `/consent?${q.toString()}`;
      router.push(url);
    }
  }, [sp, router]);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); // optional
  const [notes, setNotes] = useState("");

  const baseParams = useMemo(() => {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    return q;
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    if (didNavigate.current) return;
    didNavigate.current = true;

    const q = new URLSearchParams(baseParams.toString());
    q.set("name", fullName.trim());
    q.set("phone", cleanPhone(phone));

    if (email.trim()) q.set("email", email.trim());
    if (notes.trim()) q.set("notes", notes.trim());

    // Go to confirmation (your app already uses /confirmation)
    const nextUrl = `/confirmation?${q.toString()}`;

    // ✅ single navigation, no double-run issues
    window.location.assign(nextUrl);
  };

  return (
    <AppShell>
      <div className="w-full max-w-md mx-auto flex flex-col items-center pt-0 mt-0" style={{marginTop: '0'}}>
        <h1 className="text-[24px] font-extrabold text-center mb-1">Contact Info</h1>
        <div className="text-[17px] text-white/80 text-center mb-1 font-semibold">Where should we send your options?</div>
        <form onSubmit={onSubmit} className="w-full mt-0 text-left relative z-50">
          <label className="block mt-[4px]">
            <span className="block text-[11px] font-extrabold tracking-wide text-white/70">FULL NAME</span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              className="mt-[4px] w-full rounded px-[10px] py-[10px] text-[13px] font-semibold bg-white/10 border border-white/15 text-white placeholder:text-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30"
              placeholder="First & last"
            />
          </label>
          <label className="block mt-[4px]">
            <span className="block text-[11px] font-extrabold tracking-wide text-white/70">PHONE NUMBER</span>
            <input
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              inputMode="tel"
              autoComplete="tel"
              className="mt-[4px] w-full rounded px-[10px] py-[10px] text-[13px] font-semibold bg-white/10 border border-white/15 text-white placeholder:text-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30"
              placeholder="(555) 555-5555"
            />
          </label>
          <label className="block mt-[4px]">
            <span className="block text-[11px] font-extrabold tracking-wide text-white/70">EMAIL (OPTIONAL)</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputMode="email"
              autoComplete="email"
              className="mt-[4px] w-full rounded px-[10px] py-[10px] text-[13px] font-semibold bg-white/10 border border-white/15 text-white placeholder:text-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30"
              placeholder="name@email.com"
            />
          </label>
          <label className="block mt-[4px]">
            <span className="block text-[11px] font-extrabold tracking-wide text-white/70">NOTES (OPTIONAL)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-[4px] w-full rounded px-[10px] py-[10px] text-[13px] font-semibold bg-white/10 border border-white/15 text-white placeholder:text-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30"
              placeholder="Anything we should know?"
            />
          </label>
          <button
            type="submit"
            disabled={!isValid}
            className={[
              "mt-[8px] block w-full py-[12px] rounded text-[16px] font-extrabold transition active:scale-[0.99]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30",
              isValid
                ? "bg-[#ff385c] text-white shadow-[0_1px_2px_rgba(255,56,92,0.18)]"
                : "bg-white/10 border border-white/15 text-white/40 cursor-not-allowed",
            ].join(" ")}
          >
            Continue
          </button>
          <p className="mt-[8px] text-[10px] text-white/45 text-center">Not affiliated with any government agency.</p>
        </form>
      </div>
    </AppShell>
  );
}
