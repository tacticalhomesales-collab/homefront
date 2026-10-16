"use client";

import { track } from "@vercel/analytics";
import { Analytics } from "@vercel/analytics/react";
import AppShell from "../../components/AppShell";

type ContactAction = "call" | "text";

function trackTap(action: ContactAction) {
  // A button tap is not proof of a completed call or a delivered message.
  const eventName = action === "call" ? "chatgpt_call_tap" : "chatgpt_text_tap";
  try {
    track(eventName, { source: "chatgpt", campaign: "north_county" });
  } catch {}
  try {
    const tag = window.gtag as unknown as
      | ((command: "event", name: string, parameters: Record<string, string>) => void)
      | undefined;
    tag?.("event", eventName, { source: "chatgpt", campaign: "north_county" });
  } catch {}
}

export default function AdContact() {
  return (
    <AppShell>
      <section className="mx-auto flex w-full max-w-md flex-col items-center px-3 pb-12 text-center">
        <p className="mt-2 text-sm font-bold uppercase tracking-wider text-white/70">
          Veteran-Led Real Estate • North County San Diego
        </p>
        <h1 className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl">
          Ready to Buy or Sell?
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
          Call or text HomeFront for a free, no-obligation conversation
          about buying, selling, or purchasing a home with a VA loan.
        </p>
        <p className="mt-4 text-xs font-semibold text-white/70">
          Fallbrook • Oceanside • Bonsall • Vista • San Marcos
        </p>
        <div className="mt-6 flex w-full flex-col gap-3">
          <a
            className="flex min-h-14 items-center justify-center rounded-xl bg-[#ff385c] px-4 text-lg font-bold text-white shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            href="tel:+14424368161"
            onClick={() => trackTap("call")}
          >
            Call HomeFront Now
          </a>
          <a
            className="flex min-h-14 items-center justify-center rounded-xl border border-white/40 bg-white/10 px-4 text-lg font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            href="sms:+14424368161"
            onClick={() => trackTap("text")}
          >
            Text HomeFront Now
          </a>
        </div>
        <a href="tel:+14424368161" className="mt-4 text-base font-bold underline underline-offset-4">
          (442) 436-8161
        </a>
        <p className="mt-6 text-xs leading-relaxed text-white/50">
          We provide real estate guidance, not loan approval. VA eligibility
          and lending decisions are made by the VA and participating lenders.
        </p>
      </section>
      <Analytics />
    </AppShell>
  );
}
