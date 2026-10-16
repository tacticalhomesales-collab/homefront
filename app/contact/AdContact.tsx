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
      <section className="mx-auto flex w-full max-w-[520px] flex-col items-center px-1 pb-12 text-center">
        <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#ff98ad]">
          Veteran-Led Real Estate · North County San Diego
        </p>

        <div className="relative mt-3 w-full overflow-hidden rounded-xl border border-white/15 bg-white/5">
          <Image
            src="/homefront-team.avif"
            alt="The HomeFront Realty Group team in front of the HomeFront sign"
            width={550}
            height={353}
            className="h-auto w-full object-cover"
            priority
          />
        </div>

        <h1 className="mt-5 text-[clamp(25px,6vw,32px)] font-extrabold leading-tight tracking-tight">
          Ready to Buy or Sell?
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/85">
          Buying, selling, or using a VA loan? Speak directly with HomeFront&apos;s
          veteran-led real estate team.
        </p>
        <p className="mt-2 text-sm font-bold text-[#ffadbd]">
          Free consultation · No obligation
        </p>

        <div className="mt-5 flex w-full flex-col gap-3">
          <a
            href="tel:+14424368161"
            onClick={() => trackTap("call")}
            className="flex min-h-[60px] items-center justify-center rounded-xl bg-[#ff385c] px-4 py-3 text-[17px] font-extrabold text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Speak With a Realtor
          </a>
          <a
            href="sms:+14424368161"
            onClick={() => trackTap("text")}
            className="flex min-h-[60px] items-center justify-center rounded-xl border border-white/35 bg-white/10 px-4 py-3 text-[17px] font-extrabold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Text a Realtor Now
          </a>
        </div>

        <a
          href="tel:+14424368161"
          className="mt-5 text-base font-bold text-white underline underline-offset-4"
        >
          (442) 436-8161
        </a>
        <p className="mt-4 text-xs leading-relaxed text-white/60">
          Fallbrook · Oceanside · Bonsall · Vista · San Marcos
        </p>
        <p className="mt-6 max-w-md text-[11px] leading-relaxed text-white/45">
          HomeFront provides real estate guidance. VA loan eligibility
          and approval are determined by the VA and participating lenders.
        </p>
      </section>
      <Analytics />
    </AppShell>
  );
}
