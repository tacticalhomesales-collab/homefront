"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PartnerEntryPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if partner exists
    const partner = localStorage.getItem("hf_partner");

    if (partner) {
      router.replace("/partner/dashboard");
    } else {
      router.replace("/partner/signup");
    }
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-[100dvh] w-full bg-[#0b0f14] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );
}
