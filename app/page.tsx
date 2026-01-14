"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LaunchOverlay from "./_components/LaunchOverlay";
import ShareSheetModal from "./_components/ShareSheetModal";

export default function LandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Auto-open share if ?share=1
    if (searchParams.get("share") === "1") {
      setShowShare(true);
    }
  }, [searchParams]);

  return (
    <>
      <LaunchOverlay />

      <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-3">
        <div
          className={[
            "min-h-[100dvh] flex flex-col items-center text-center pt-6 pb-9",
            "transition-opacity duration-200 ease-out",
            mounted ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <div className="w-full max-w-[360px] relative">
            {/* Logo */}
            <div className="mx-auto w-full max-w-[220px] mt-12 pointer-events-none select-none">
              <img
                src="/homefront-logo.png"
                alt="HomeFront"
                width={400}
                height={200}
                className="w-full h-auto"
                draggable={false}
              />
            </div>

            {/* CTA */}
            <div className="mt-6 flex items-center justify-center gap-2.5 text-[16px] font-extrabold tracking-[-0.02em] text-white/80 pointer-events-none">
              <span className="text-white/25">•</span>
              <span className="whitespace-nowrap">
                Streamlined access to your housing benefits
              </span>
              <span className="text-white/25">•</span>
            </div>

            {/* Get Started -> /choose */}
            <div className="mt-6 relative z-50">
              <button
                type="button"
                onClick={() => router.push("/choose")}
                className="cursor-pointer pointer-events-auto block w-[calc(100%+2.0rem)] -mx-4 py-3.5 rounded-2xl
                           bg-[#ff385c] text-white text-[19px] font-extrabold
                           active:scale-[0.99] transition
                           shadow-[0_10px_30px_rgba(255,56,92,0.25)]
                           focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30"
              >
                Get Started
              </button>
            </div>

            {/* Secondary CTAs */}
            <div className="mt-3 relative z-50 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setShowShare(true)}
                className="cursor-pointer pointer-events-auto block w-[calc(100%+2.0rem)] -mx-4 py-3.5 rounded-2xl
                           border border-white/15 bg-white/10 text-white text-[16px] font-extrabold
                           hover:bg-white/15 active:scale-[0.99] transition
                           focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
              >
                Share
              </button>
              <button
                type="button"
                onClick={() => router.push("/refer")}
                className="cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl
                           border border-white/15 bg-white/10 text-white text-[18px] font-extrabold
                           hover:bg-white/15 active:scale-[0.99] transition
                           focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
              >
                Refer a Friend
              </button>
              <button
                type="button"
                onClick={() => router.push("/partner")}
                className="cursor-pointer pointer-events-auto block w-[calc(100%+2.0rem)] -mx-4 py-3.5 rounded-2xl
                           border border-white/15 bg-white/10 text-white text-[16px] font-extrabold
                           hover:bg-white/15 active:scale-[0.99] transition
                           focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
              >
                Partner Portal
              </button>
            </div>

            <p className="mt-4 text-[10px] text-white/45">
              Not affiliated with any government agency.
            </p>
          </div>
        </div>
      </main>

      <ShareSheetModal isOpen={showShare} onClose={() => setShowShare(false)} />
    </>
  );
}
