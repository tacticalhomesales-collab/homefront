import React from "react";

type PhoneShellProps = {
  title: string;
  subtitle?: string;
  meta?: string;
  children: React.ReactNode;
};

export default function PhoneShell({ title, subtitle, meta, children }: PhoneShellProps) {
  return (
    <main className="min-h-[100dvh] w-full text-white px-3 overflow-x-hidden">
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

      <div className="min-h-[100dvh] flex flex-col items-center text-center pt-3 pb-6">
        <div className="w-full max-w-[340px] relative">
          {/* Invisible spacer row to match other pages */}
          <div className="mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[18px] font-extrabold tracking-[-0.02em] text-white/80 opacity-0 pointer-events-none select-none">
            <span>Buy</span>
            <span className="text-white/25">•</span>
            <span>Sell</span>
            <span className="text-white/25">•</span>
            <span>Rent</span>
            <span className="text-white/25">•</span>
            <span>Manage</span>
          </div>

          {/* Logo */}
          <div className="mx-auto w-full max-w-[180px] mt-4 pointer-events-none select-none">
            <img
              src="/homefront-badge.png"
              alt="HomeFront"
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* Title + subtitle */}
          <div className="-mt-1 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none text-white">
              {title}
            </h1>

            {subtitle ? (
              <p className="mt-2 text-[12px] font-semibold text-white/70">{subtitle}</p>
            ) : null}

            {meta ? <p className="mt-2 text-[10px] text-white/45">{meta}</p> : null}
          </div>

          <div className="mt-2 relative z-50">{children}</div>

          <p className="mt-3 text-[10px] text-white/45">
            Not affiliated with any government agency.
          </p>
        </div>
      </div>
    </main>
  );
}
