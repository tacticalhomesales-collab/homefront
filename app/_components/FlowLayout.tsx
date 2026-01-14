"use client";

import React, { useEffect, useState } from "react";

type FlowLayoutProps = {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  children: React.ReactNode;
};

export default function FlowLayout({
  title,
  subtitle,
  showLogo = true,
  children,
}: FlowLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-[100dvh] w-full text-white px-4 overflow-x-hidden">
      {/* Background (deep blue + subtle texture) */}
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

      {/* Page transition wrapper */}
      <div
        className={[
          "min-h-[100dvh] flex flex-col items-center text-center pt-8 pb-10",
          "transition-opacity duration-200 ease-out",
          mounted ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <div className="w-full max-w-md relative">
          {/* Fixed height header zone to prevent layout shift */}
          <div className="min-h-[280px]">
            {/* Invisible spacer row (maintains vertical rhythm) */}
            <div className="mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[18px] font-extrabold tracking-[-0.02em] text-white/80 opacity-0 pointer-events-none select-none">
              <span>Buy</span>
              <span className="text-white/25">•</span>
              <span>Sell</span>
              <span className="text-white/25">•</span>
              <span>Rent</span>
              <span className="text-white/25">•</span>
              <span>Manage</span>
            </div>

            {/* Logo - EXACT same position across all pages */}
            {showLogo && (
              <div className="mx-auto w-full max-w-[95vw] mt-16 pointer-events-none select-none">
                <img
                  src="/homefront-badge.png"
                  alt="HomeFront"
                  width={400}
                  height={200}
                  className="w-full h-auto scale-200 origin-center"
                  draggable={false}
                />
              </div>
            )}

            {/* Title zone - consistent positioning */}
            <div className="-mt-6 flex flex-col items-center justify-center pointer-events-none">
              <h1 className="text-4xl font-extrabold tracking-tight leading-none text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-3 text-sm font-semibold text-white/70">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Content zone - consistent top spacing */}
          <div className="mt-3">{children}</div>

          {/* Footer disclaimer - consistent position */}
          <p className="mt-5 text-[11px] text-white/45">
            Not affiliated with any government agency.
          </p>
        </div>
      </div>
    </main>
  );
}
