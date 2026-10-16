"use client";

import { track } from "@vercel/analytics";
import { Analytics } from "@vercel/analytics/react";
import Image from "next/image";
import AppShell from "../../components/AppShell";

type ContactAction = "call" | "text";

function trackTap(action: ContactAction) {
  // Taps indicate intent. They do not prove a connected call or a delivered text.
  const eventName = action === "call" ? "chatgpt_call_tap" : "chatgpt_text_tap";
  try {
    track(eventName, { source: "chatgpt", campaign: "north_county" });
  } catch {
    // Calling/texting must never be blocked by analytics.
  }
  try {
    const tag = window.gtag as unknown as
      | ((command: string, name: string, parameters: Record<string, string>) => void)
      | undefined;
    tag?.("event", eventName, { source: "chatgpt", campaign: "north_county" });
  } catch {
    // Calling/texting must never be blocked by analytics.
  }
}

export default function AdContact() {
  return (
    <AppShell>
      <section className="flex w-full flex-col items-center pb-12 text-center">
        <h1
          className="mb-3 block w-full text-center font-extrabold leading-tight tracking-tight text-white"
          style={{
            fontSize: "clamp(1.4rem,4vw,2.1rem)",
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            textShadow: "0 2px 16px rgba(0,0,0,0.12)",
          }}
        >
          Your Next Move Starts Here.
        </h1>
        <p className="mb-4 px-2 text-center text-[clamp(12px,3.2vw,14px)] font-semibold leading-snug text-white">
          Buying, selling, or using a VA loan? Connect <span className="text-amber-300">DIRECTLY</span> with HomeFront&apos;s veteran-led Realtors.
        </p>

        {/* Match the grey navigation tiles used on the HomeFront homepage. */}
        <div className="grid w-full grid-cols-2 gap-3">
          <a
            href="tel:+14424368161"
            onClick={() => trackTap("call")}
            className="flex min-h-[82px] flex-col items-center justify-center rounded-lg border border-white/15 bg-white/10 px-2 py-3 text-center text-white shadow-md transition-colors hover:border-[#ff385c] hover:bg-[#ff385c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff385c]"
          >
            <span className="text-[clamp(13px,3.2vw,16px)] font-extrabold leading-tight">Talk to a Realtor Now</span>
            <span className="mt-1 text-[11px] font-medium text-white/80">Call our local team</span>
          </a>
          <a
            href="sms:+14424368161"
            onClick={() => trackTap("text")}
            className="flex min-h-[82px] flex-col items-center justify-center rounded-lg border border-white/15 bg-white/10 px-2 py-3 text-center text-white shadow-md transition-colors hover:border-[#ff385c] hover:bg-[#ff385c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff385c]"
          >
            <span className="text-[clamp(13px,3.2vw,16px)] font-extrabold leading-tight">Text a Realtor Now</span>
            <span className="mt-1 text-[11px] font-medium text-white/80">Send a message directly</span>
          </a>
        </div>

        <div className="mt-4 w-full overflow-hidden rounded-lg border border-white/15 bg-white/10">
          <Image
            src="/homefront-team-sharp.jpg"
            alt="The HomeFront Realty Group team"
            width={1122}
            height={720}
            unoptimized
            className="h-auto w-full object-cover"
            priority
          />
        </div>

        <p className="mt-4 text-center text-sm font-semibold text-white">
          Real people. Local expertise. <span className="text-amber-300">No obligation.</span>
        </p>
        <a href="tel:+14424368161" className="mt-3 text-base font-bold text-white underline underline-offset-4">
          (442) 436-8161
        </a>
        <p className="mt-3 text-center text-xs text-white/60">
          Fallbrook · Oceanside · Bonsall · Vista · San Marcos
        </p>
        <p className="mt-5 max-w-md text-center text-[11px] leading-relaxed text-white/45">
          HomeFront provides real estate guidance. VA loan eligibility and approval are determined by the VA and participating lenders.
        </p>
      </section>
      <Analytics />
    </AppShell>
  );
}
