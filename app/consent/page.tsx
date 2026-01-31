"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import AppShell from "../../components/AppShell";

function CheckboxRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      {/* Real checkbox (accessible), hidden */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />

      {/* Custom box — ALWAYS the same size */}
      <span
        className={[
          "shrink-0",
          "w-6 h-6", // ✅ fixed square
          "rounded",
          "border-2 border-white/25",
          "bg-white/10",
          "flex items-center justify-center",
          "transition-colors duration-150",
          "peer-checked:bg-[#ff385c] peer-checked:border-[#ff385c]",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-[#ff385c]/50",
        ].join(" ")}
        aria-hidden="true"
      >
        {/* Check icon (only visible when checked) */}
        <svg
          viewBox="0 0 20 20"
          className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 10.5l3.2 3.2L16 5.9" />
        </svg>
      </span>

      {/* Text */}
      <span className="text-[14px] font-semibold text-white/80 leading-snug">
        {children}
      </span>
    </label>
  );
}

export default function ConsentPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [consentContact, setConsentContact] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [pressed, setPressed] = useState(false);

  const canContinue = consentContact && consentTerms;

  const goNext = () => {
    if (!canContinue || pressed) return;
    setPressed(true);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("consent_contact", "1");
    q.set("consent_terms", "1");

    const url = `/verify?${q.toString()}`;

    setTimeout(() => {
      try {
        router.push(url);
      } finally {
        setTimeout(() => {
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.startsWith("/verify")
          ) {
            window.location.assign(url);
          }
        }, 250);
      }
    }, 120);
  };

  const getParamString = () => {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    return q.toString();
  };

  return (
    <AppShell>
      <div className="w-full max-w-md relative mx-auto text-left px-4 pt-8 pb-10">
        <div className="flex flex-col items-center justify-center pointer-events-none mb-5">
          <h1 className="text-4xl font-extrabold tracking-tight leading-none text-white">
            Consent & Terms
          </h1>
          <p className="mt-3 text-sm font-semibold text-white/70">
            Please review and accept to continue.
          </p>
        </div>

        <div className="relative z-50 text-left space-y-4">
          <CheckboxRow checked={consentContact} onChange={setConsentContact}>
            I agree to be contacted by HomeFront and/or its partners regarding my real
            estate needs.
          </CheckboxRow>

          <CheckboxRow checked={consentTerms} onChange={setConsentTerms}>
            I accept the{" "}
            <Link
              href={`/terms?${getParamString()}`}
              className="text-[#ff385c] underline"
            >terms and conditions</Link>
          </CheckboxRow>

          <button
            type="button"
            className="mt-6 w-full py-2 rounded-lg bg-[#ff385c] text-white font-extrabold text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canContinue || pressed}
            onClick={goNext}
          >
            Continue
          </button>
        </div>
      </div>
    </AppShell>
  );
}
