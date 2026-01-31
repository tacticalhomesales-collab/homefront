"use client";

import AppShell from "../../components/AppShell";

export default function CompletionPage() {
  return (
    <AppShell>
      <div className="w-full max-w-md mx-auto text-center pt-12 pb-16 px-4">
        <h1 className="text-4xl font-extrabold mb-4">Thank You!</h1>
        <p className="text-lg text-white/80 mb-8">
          Your referral has been submitted successfully.
        </p>
        <button
          onClick={() => window.location.href = "/"}
          className="mb-6 px-6 py-3 rounded-xl bg-[#ff385c] text-white font-bold text-base shadow-md hover:bg-[#e03250] transition"
        >
          Return to Home
        </button>
        <p className="text-white/60 text-sm">
          We appreciate your trust in HomeFront. Our team will reach out to your referral soon.
        </p>
      </div>
    </AppShell>
  );
}
