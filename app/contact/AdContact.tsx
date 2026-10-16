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
    <AppShell hideBrandHeader>
      <section className="mx-auto flex w-full max-w-[520px] flex-col items-center pb-7 pt-2 text-center">
        <div className="mb-2 flex w-full justify-between px-1 text-xs">
          <span className="font-extrabold tracking-wide text-white">HOMEFRONT</span>
          <a href="/" aria-label="Back to HomeFront homepage" className="font-medium text-white/70 underline-offset-4 hover:underline">
            ← Home
          </a>
        </div>
        <div className="relative h-[188px] w-full overflow-hidden rounded-lg border border-white/15 bg-white/10 sm:h-[230px]">
          <Image
            src="/homefront-team-sharp.jpg"
            alt="HomeFront's veteran-led real estate team"
            fill
            sizes="(max-width: 520px) 100vw, 520px"
            className="object-cover object-center"
            priority
          />
        </div>
        <h1 className="mt-3 text-[clamp(23px,6vw,30px)] font-extrabold leading-tight tracking-tight">
          Talk to a HomeFront Realtor
        </h1>
        <p className="mt-2 max-w-[420px] px-2 text-[13px] leading-snug text-white/80">
          Buying, selling, or using a VA loan? Connect with our veteran-led local team.
        </p>
        <div className="mt-4 grid w-full grid-cols-1 gap-2.5">
          <a href="tel:+14424368161" onClick={() => trackTap("call")}
            className="flex min-h-[58px] items-center justify-center rounded-lg bg-[#ff385c] px-3 py-3 text-[17px] font-extrabold text-white shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Talk to an Agent Now
          </a>
          <a href="sms:+14424368161" onClick={() => trackTap("text")}
            className="flex min-h-[58px] items-center justify-center rounded-lg border border-white/30 bg-white/10 px-3 py-3 text-[17px] font-extrabold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Message an Agent Now
          </a>
        </div>
        <a href="tel:+14424368161" className="mt-3 text-sm font-semibold text-white/90 underline underline-offset-4">(442) 436-8161</a>
        <p className="mt-3 text-[11px] text-white/55">Fallbrook · Oceanside · Bonsall · Vista · San Marcos</p>
        <p className="mt-3 max-w-[450px] text-[10px] leading-relaxed text-white/40">
          Free, no-obligation consultation. VA loan eligibility and approval are determined by the VA and participating lenders.
        </p>
      </section>
      <Analytics />
    </AppShell>
  );
}
