"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import AppShell from "../../components/AppShell";

type VerifyStage = "verifying" | "verified";

export default function VerifyPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [verifyStage, setVerifyStage] = useState<VerifyStage>("verifying");
  const t1Ref = useRef<NodeJS.Timeout | null>(null);
  const t2Ref = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Auto-start verification on mount
    t1Ref.current = setTimeout(() => {
      setVerifyStage("verified");
    }, 2500);

    t2Ref.current = setTimeout(() => {
      const q = new URLSearchParams();
      for (const [k, v] of sp.entries()) q.set(k, v);
      q.set("verified", "1");
      const url = `/contact?${q.toString()}`;
      
      try {
        router.push(url);
      } finally {
        setTimeout(() => {
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/contact")) {
            window.location.assign(url);
          }
        }, 250);
      }
    }, 3000);

    return () => {
      if (t1Ref.current) clearTimeout(t1Ref.current);
      if (t2Ref.current) clearTimeout(t2Ref.current);
    };
  }, [router, sp]);

  return (
    <AppShell>
      {/* Verification Overlay */}
      <div className="absolute inset-0 bg-black/85 z-[9999] flex items-center justify-center">
        <div className="text-center">
          {verifyStage === "verifying" && (
            <div className="flex flex-col items-center gap-4">
              <svg
                className="animate-spin h-[200px] w-[400px] text-white"
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
              <p className="text-lg font-semibold">Verifying...</p>
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
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 13l3 3 7-7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                />
              </svg>
              <p className="text-2xl font-bold text-green-400 mt-2">Verified!</p>
              <p className="text-base text-white/80">Your information has been successfully verified.</p>
            </div>
          )}
        </div>
      </div>

      {/* Background content (not visible during overlay) */}
      <div className="w-full max-w-md mx-auto">
        <div className="-mt-6 flex flex-col items-center justify-center pointer-events-none">
          <h1 className="text-4xl font-extrabold tracking-tight leading-none">
            Verification
          </h1>
          <p className="mt-3 text-sm font-semibold text-white/70">
            Please wait while we verify your information...
          </p>
        </div>
      </div>
    </AppShell>
  );
}
