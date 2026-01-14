"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ContactContent() {
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
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4">
      <div className="min-h-[100dvh] flex flex-col items-center text-center pt-8 pb-10">
        <div className="w-full max-w-md relative">
          <div className="mx-auto w-full max-w-[95vw] mt-16 pointer-events-none select-none">
            <img
              src="/homefront-badge.png"
              alt="HomeFront"
              className="w-full h-auto scale-200 origin-center"
              draggable={false}
            />
          </div>

          <div className="-mt-6 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-extrabold tracking-tight leading-none">
              Contact Info
            </h1>
            <p className="mt-3 text-sm font-semibold text-white/70">
              Where should we send your options?
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-5 text-left relative z-50">
            <label className="block">
              <span className="block text-[12px] font-extrabold tracking-wide text-white/70">
                FULL NAME
              </span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                className={[
                  "mt-2 w-full rounded-2xl px-4 py-4 text-[16px] font-semibold",
                  "bg-white/10 border border-white/15 text-white placeholder:text-white/35",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                ].join(" ")}
                placeholder="First & last"
              />
            </label>

            <label className="block mt-4">
              <span className="block text-[12px] font-extrabold tracking-wide text-white/70">
                PHONE NUMBER
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                inputMode="tel"
                autoComplete="tel"
                className={[
                  "mt-2 w-full rounded-2xl px-4 py-4 text-[16px] font-semibold",
                  "bg-white/10 border border-white/15 text-white placeholder:text-white/35",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                ].join(" ")}
                placeholder="(555) 555-5555"
              />
            </label>

            <label className="block mt-4">
              <span className="block text-[12px] font-extrabold tracking-wide text-white/70">
                EMAIL (OPTIONAL)
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                inputMode="email"
                autoComplete="email"
                className={[
                  "mt-2 w-full rounded-2xl px-4 py-4 text-[16px] font-semibold",
                  "bg-white/10 border border-white/15 text-white placeholder:text-white/35",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                ].join(" ")}
                placeholder="name@email.com"
              />
            </label>

            <label className="block mt-4">
              <span className="block text-[12px] font-extrabold tracking-wide text-white/70">
                NOTES (OPTIONAL)
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={[
                  "mt-2 w-full rounded-2xl px-4 py-4 text-[16px] font-semibold",
                  "bg-white/10 border border-white/15 text-white placeholder:text-white/35",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                ].join(" ")}
                placeholder="Anything we should know?"
              />
            </label>

            <button
              type="submit"
              disabled={!isValid}
              className={[
                "mt-5 block w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl text-[21px] font-extrabold transition active:scale-[0.99]",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                isValid
                  ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]"
                  : "bg-white/10 border border-white/15 text-white/40 cursor-not-allowed",
              ].join(" ")}
            >
              Continue
            </button>

            <p className="mt-4 text-[11px] text-white/45 text-center">
              Not affiliated with any government agency.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] w-full bg-[#0b0f14]" />}>
      <ContactContent />
    </Suspense>
  );
}

export default dynamic(() => Promise.resolve(ContactPage), { ssr: false });
