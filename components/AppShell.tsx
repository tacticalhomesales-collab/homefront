"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { IntentBanner } from "./IntentVisuals";

type AppShellProps = {
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function AppShell({ children, footer }: AppShellProps) {
  const sp = useSearchParams();
  const mission = sp.get("mission");
  const pathname = usePathname();
  const router = useRouter();

  // Hide banner for all referral-related routes
  const hideBanner = pathname.startsWith("/refer") || pathname.startsWith("/refer-");
  // Apply fit-to-viewport style to all pages except /share
  const isShareRoute = pathname.startsWith("/share");
  return (
    <main className={["w-full bg-[#0b0f14] flex flex-col items-center text-white px-4 overflow-x-hidden", !isShareRoute ? "min-h-screen h-screen max-h-screen overflow-hidden" : "min-h-[100dvh]"].join(" ")}>
      <div className={["w-full max-w-[520px] flex flex-col mx-auto relative", !isShareRoute ? "min-h-screen h-screen max-h-screen overflow-hidden justify-start" : "min-h-[100dvh]"].join(" ")}>
        {/* Portal Banner at very top */}
        {!hideBanner && mission && (
          <div className="w-full sticky top-0 left-0 z-50 -mb-2">
            <IntentBanner intent={mission} />
          </div>
        )}

        {/* Header: size to content (NO fixed 30svh height) */}
        <header className="pt-2 pb-2 flex items-center justify-center">
          {pathname === "/" ? (
            <button
              aria-label="Go to Share Page"
              onClick={() => router.push("/share")}
              className="group relative p-2 rounded-2xl outline-none border-2 border-transparent focus-visible:ring-2 focus-visible:ring-[#ff385c] transition-all"
              style={{ background: "none", border: "none", margin: 0, cursor: "pointer" }}
            >
              <span
                className="absolute inset-0 z-10 rounded-2xl pointer-events-none border-4 border-transparent group-hover:border-[#ff385c] group-active:border-[#ff385c] group-hover:shadow-[0_0_0_6px_rgba(255,56,92,0.18)] group-active:shadow-[0_0_0_10px_rgba(255,56,92,0.22)] transition-all duration-300"
                aria-hidden="true"
              ></span>
              <img
                src="/homefront-badge.png?v=101"
                alt="HomeFront"
                draggable={false}
                className="select-none object-contain relative z-20"
                style={{
                  width: "clamp(300px, 95vw, 520px)",
                  height: "auto",
                  display: "block",
                }}
              />
            </button>
          ) : (
            <img
              src="/homefront-badge.png?v=101"
              alt="HomeFront"
              draggable={false}
              className="pointer-events-none select-none object-contain"
              style={{
                width: "clamp(300px, 95vw, 520px)",
                height: "auto",
                display: "block",
              }}
            />
          )}
        </header>

        {/* Content */}
        <div className="flex flex-col w-full">{children}</div>

        {/* Footer */}
        {footer ? <footer className="mt-auto w-full pb-4">{footer}</footer> : null}
      </div>
    </main>
  );
}
