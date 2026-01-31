"use client";

import React from "react";

type ChoiceButtonProps = {
  label: string;
  sub?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export default function ChoiceButton({ label, sub, active, disabled, onClick }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "w-full rounded-xl px-2 py-2 text-center transition active:scale-[0.99]",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
        active
          ? "bg-[#ff385c] text-white shadow-[0_4px_10px_rgba(255,56,92,0.18)]"
          : "border border-white/15 bg-white/10 text-white hover:bg-white/15",
        disabled ? "cursor-not-allowed opacity-80" : "cursor-pointer",
      ].join(" ")}
    >
      <div className="flex flex-col items-center">
        <span className="text-[13px] font-extrabold tracking-[-0.02em] leading-tight">{label}</span>
        {sub ? <span className="mt-0.5 text-[10px] font-semibold text-white/65">{sub}</span> : null}
      </div>
    </button>
  );
}
