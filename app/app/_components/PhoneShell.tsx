import React from "react";

type PhoneShellProps = {
  title: string;
  subtitle?: string;
  meta?: string;
  children: React.ReactNode;
};

export default function PhoneShell({ title, subtitle, meta, children }: PhoneShellProps) {
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

      <div className="min-h-[100dvh] flex flex-col items-center text-center pt-7 pb-10">
        <div className="w-full max-w-[420px] relative">
          {/* Logo */}
          <div className="mx-auto mt-2 w-full max-w-[240px] pointer-events-none select-none">
            <img
              src="/homefront-badge.png"
              alt="HomeFront"
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* Title + subtitle */}
          <div className="mt-4 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none text-white">
              {title}
            </h1>

            {subtitle ? (
              <p className="mt-2 text-sm font-semibold text-white/70">{subtitle}</p>
            ) : null}

            {meta ? <p className="mt-2 text-[11px] text-white/45">{meta}</p> : null}
          </div>

          <div className="mt-5">{children}</div>
        </div>
      </div>
    </main>
  );
}
