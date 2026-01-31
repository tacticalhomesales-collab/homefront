"use client";

import React from "react";

type PriorityButtonProps = {
  label: string;
  value: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: (value: string) => void;
};

export default function PriorityButton({ label, value, active, disabled, onClick }: PriorityButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onClick && onClick(value)}
      className={[
        "w-full rounded-2xl px-4 py-4 text-center transition active:scale-[0.99]",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
        active
          ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]"
          : "border border-white/15 bg-white/10 text-white hover:bg-white/15",
        disabled ? "cursor-not-allowed opacity-80" : "cursor-pointer",
      ].join(" ")}
    >
      <div className="flex flex-col items-center">
        <span className="text-[18px] font-extrabold tracking-[-0.02em] leading-tight">{label}</span>
      </div>
    </button>
  );
}
