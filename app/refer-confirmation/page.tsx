"use client";

import { useRouter } from "next/navigation";
import FlowLayout from "../_components/FlowLayout";

export default function ReferConfirmationPage() {
  const router = useRouter();

  return (
    <FlowLayout
      title="Thank You!"
      subtitle="Your referral has been submitted successfully."
      logoSrc="/homefront-logo.png"
      logoAlt="HomeFront Logo"
    >
      <div className="relative z-50 flex flex-col gap-6">
        {/* Success message */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-white/80 text-base">
            We'll reach out to your friend soon to help them get started.
            <br />
            <br />
            We appreciate your trust in HomeFront!
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push("/refer")}
            className="w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl
                       bg-[#ff385c] text-white text-[21px] font-extrabold
                       active:scale-[0.99] transition
                       shadow-[0_10px_30px_rgba(255,56,92,0.25)]
                       focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30"
          >
            Refer Another Friend
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl
                       border border-white/15 bg-white/10 text-white text-[18px] font-extrabold
                       hover:bg-white/15 active:scale-[0.99] transition
                       focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
          >
            Back to Home
          </button>
        </div>
      </div>
    </FlowLayout>
  );
}
