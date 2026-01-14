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
        <main className="min-h-[100dvh] w-full text-white px-4 overflow-x-hidden">
          {/* Background match to other pages */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-[#0b0f14]" />
            <div
              className="absolute inset-0 opacity-90"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.10), transparent 38%)," +
                  "radial-gradient(circle at 80% 20%, rgba(255,56,92,0.10), transparent 40%)," +
                  "radial-gradient(circle at 50% 120%, rgba(0,0,0,0.70), transparent 55%)," +
                  "linear-gradient(180deg, rgba(255,255,255,0.06), transparent 35%)",
              }}
            />
          </div>

          <div
            className={[
              "min-h-[100dvh] flex flex-col items-center text-center pt-6 pb-8",
              "transition-opacity duration-200 ease-out",
              mounted ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            <div className="w-full max-w-[380px] relative">
              <div className="mx-auto w-full max-w-[210px] mt-6 pointer-events-none select-none">
                <img
                  src="/homefront-logo.png"
                  alt="HomeFront"
                  width={360}
                  height={180}
                  className="w-full h-auto"
                  draggable={false}
                />
              </div>
                src="/homefront-logo.png"
                alt="HomeFront"
              <div className="mt-5 flex items-center justify-center gap-3 text-[15px] font-extrabold tracking-[-0.02em] text-white/80 pointer-events-none">
                <span className="text-white/30">•</span>
                <span className="whitespace-nowrap">Streamlined housing benefits</span>
                <span className="text-white/30">•</span>

            {/* CTA */}
            <div className="mt-8 flex items-center justify-center gap-3 text-[18px] font-extrabold tracking-[-0.02em] text-white/80 pointer-events-none">
              <div className="mt-6 relative z-50">
              <span className="whitespace-nowrap">
                Streamlined access to your housing benefits
              </span>
              <span className="text-white/25">•</span>
            </div>

            {/* Get Started -> /choose */}
            <div className="mt-8 relative z-50">
              <button
                type="button"
                onClick={() => router.push("/choose")}
                className="cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl
                           bg-[#ff385c] text-white text-[21px] font-extrabold
                           active:scale-[0.99] transition
                           shadow-[0_10px_30px_rgba(255,56,92,0.25)]
                           focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30"
              >
                Get Started
              </button>
            </div>

            {/* Secondary CTAs */}
            <div className="mt-3 relative z-50 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setShowShare(true)}
                className="cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl
                           border border-white/15 bg-white/10 text-white text-[18px] font-extrabold
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
                className="cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl
                           border border-white/15 bg-white/10 text-white text-[18px] font-extrabold
                           hover:bg-white/15 active:scale-[0.99] transition
                           focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
              >
                Partner Portal
              </button>
            </div>
            <p className="mt-4 text-[10px] text-white/45">Not affiliated with any government agency.</p>
          </div>
        </div>
      </main>

      <ShareSheetModal isOpen={showShare} onClose={() => setShowShare(false)} />
    </>
  );
}
