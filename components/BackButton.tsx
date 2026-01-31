"use client";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="absolute top-3 left-3 z-50 flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full bg-white/5 hover:bg-white/15 text-white border border-white/10 shadow-sm backdrop-blur transition-all"
      aria-label="Go back"
      style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}
    >
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="inline-block">
        <path d="M12.5 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="hidden sm:inline ml-2">Back</span>
    </button>
  );
}
