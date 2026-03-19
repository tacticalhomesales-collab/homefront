"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FlowLayout from "../_components/FlowLayout";

const SCAN_DELAY_MS = 6200;

export default function ProgramsScanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const query = searchParams.toString();
      const target = query ? `/programs-results?${query}` : "/programs-results";
      router.replace(target);
    }, SCAN_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [router, searchParams]);

  return (
    <FlowLayout
      title="Find Your Housing Benefits"
      subtitle="We use AI-powered search engines to scan federal, state, and local government websites for the most relevant housing programs for you."
    >
      <div className="flex flex-col items-center justify-start pt-10 px-2 pb-6 min-h-[60vh] text-white">
        <div className="w-full max-w-md text-center">
          <div className="mt-8 flex flex-col items-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 mb-3">
              Scanning programs
            </div>

            <div className="w-full max-w-sm">
              <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 scan-bar" />
              </div>
            </div>

            <p className="mt-4 text-[11px] text-white/70 max-w-xs text-center">
              Checking federal, state, local, and partner sites. This only takes a few seconds.
            </p>
          </div>
        </div>

        <style jsx>{`
          .scan-bar {
            animation: scanBar 1.4s ease-in-out infinite;
          }

          @keyframes scanBar {
            0% {
              transform: translateX(-120%);
            }
            50% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(120%);
            }
          }
        `}</style>
      </div>
    </FlowLayout>
  );
}
