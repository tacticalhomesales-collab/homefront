"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";
import PhoneShell from "../_components/PhoneShell";

type SubmitState = "idle" | "submitting" | "success" | "error";

function ContactContent() {
  const router = useRouter();
  const sp = useSearchParams();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string>("");

  const meta = useMemo(() => {
    const mission = sp.get("mission") || "";
    const location = sp.get("location") || "";
    return (
      (mission ? `Mission: ${mission}` : "") +
      (mission && location ? " • " : "") +
      (location ? `Location: ${location}` : "")
    );
  }, [sp]);

  const buildConfirmationHref = () => {
    const q = new URLSearchParams(sp.toString());
    q.set("name", name.trim());
    q.set("phone", phone.trim());
    return `/confirmation?${q.toString()}`;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const n = name.trim();
    const p = phone.trim();

    if (!n) return setError("Name is required.");
    if (!p) return setError("Phone number is required.");

    setState("submitting");

    try {
      const payload = {
        name: n,
        phone: p,
        email: email.trim() || undefined,
        notes: notes.trim() || undefined,

        // pass-through context from the funnel
        lane: sp.get("lane") || undefined,
        audience: sp.get("audience") || undefined,
        role: sp.get("role") || undefined,
        connected_to: sp.get("connected_to") || undefined,
        relation: sp.get("relation") || undefined,
        years_of_service: sp.get("years_of_service") || undefined,
        mission: sp.get("mission") || undefined,
        location: sp.get("location") || undefined,
        branch: sp.get("branch") || undefined,
        paygrade: sp.get("paygrade") || undefined,
        retiring_rank: sp.get("retiring_rank") || undefined,
        ref: sp.get("ref") || undefined,
      };

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Submit failed (${res.status})`);
      }

      setState("success");
      const href = buildConfirmationHref();
      setTimeout(() => router.push(href), 250);
    } catch (err: any) {
      setState("error");
      setError(err?.message || "Something went wrong submitting your info.");
    }
  };

  const submitClass =
    state === "submitting"
      ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]"
      : state === "success"
      ? "bg-[#22c55e] text-black"
      : "border border-white/15 bg-white/10 text-white hover:bg-white/15";

  return (
    <PhoneShell
      title="Contact"
      subtitle="We’ll reach out with next steps and education resources."
      meta={meta || undefined}
    >
      <form onSubmit={onSubmit} className="mt-1 relative z-50 text-left">
        <div className="flex flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-base font-semibold text-white placeholder:text-white/40 focus:outline-none focus:ring-4 focus:ring-[#ff385c]/30"
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            inputMode="tel"
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-base font-semibold text-white placeholder:text-white/40 focus:outline-none focus:ring-4 focus:ring-[#ff385c]/30"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional)"
            inputMode="email"
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-base font-semibold text-white placeholder:text-white/40 focus:outline-none focus:ring-4 focus:ring-[#ff385c]/30"
          />

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything we should know? (optional)"
            rows={4}
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-base font-semibold text-white placeholder:text-white/40 focus:outline-none focus:ring-4 focus:ring-[#ff385c]/30 resize-none"
          />
        </div>

        {error ? (
          <p className="mt-3 text-[12px] font-semibold text-[#ff385c]">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={state === "submitting" || state === "success"}
          className={[
            "mt-4 block w-full py-4 rounded-2xl text-[18px] font-extrabold transition active:scale-[0.99]",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
            submitClass,
            state !== "idle" ? "cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
        >
          {state === "submitting"
            ? "Submitting…"
            : state === "success"
            ? "Submitted ✓"
            : "Submit"}
        </button>
      </form>
    </PhoneShell>
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
