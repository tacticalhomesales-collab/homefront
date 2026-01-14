"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LaunchOverlay from "./_components/LaunchOverlay";
import ShareSheetModal from "./_components/ShareSheetModal";
import FlowLayout from "./_components/FlowLayout";

export default function LandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [showShare, setShowShare] = useState(false);
      <FlowLayout
        title="HomeFront"
        subtitle="Streamlined access to your housing benefits"
        logoSrc="/homefront-logo.png"
        logoAlt="HomeFront"
        logoWidth={520}
        logoHeight={200}
        logoContainerClassName="mx-auto w-full max-w-[280px] mt-14 pointer-events-none select-none"
        logoClassName="w-full h-auto"
      >
        {/* Primary CTA matches spacing/size from page 2 buttons */}
        <div className="relative z-50 flex flex-col gap-3">
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

          <button
            type="button"
            onClick={() => setShowShare(true)}
            className="cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl
                       border border-white/15 bg-white/10 text-white text-[21px] font-extrabold
                       hover:bg-white/15 active:scale-[0.99] transition
                       focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
          >
            Share
          </button>
          <button
            type="button"
            onClick={() => router.push("/refer")}
            className="cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl
                       border border-white/15 bg-white/10 text-white text-[21px] font-extrabold
                       hover:bg-white/15 active:scale-[0.99] transition
                       focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
          >
            Refer a Friend
          </button>
          <button
            type="button"
            onClick={() => router.push("/partner")}
            className="cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl
                       border border-white/15 bg-white/10 text-white text-[21px] font-extrabold
                       hover:bg-white/15 active:scale-[0.99] transition
                       focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
          >
            Partner Portal
          </button>
        </div>
      </FlowLayout>
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
