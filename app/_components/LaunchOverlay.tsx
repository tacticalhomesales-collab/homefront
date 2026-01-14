"use client";

import { useEffect, useState } from "react";

export default function LaunchOverlay() {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    const sessionKey = "hf_launch_shown";
    if (typeof window !== "undefined" && sessionStorage.getItem(sessionKey)) {
      setShow(false);
      return;
    }

    // Respect prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const duration = prefersReducedMotion ? 100 : 700;

    // Start fade out
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration);

    // Remove overlay
    const hideTimer = setTimeout(() => {
      setShow(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(sessionKey, "1");
      }
    }, duration + 300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[9999] bg-[#0A1C3C] flex items-center justify-center",
        "transition-opacity duration-300",
        fadeOut ? "opacity-0" : "opacity-100",
      ].join(" ")}
    >
      <div className="flex flex-col items-center gap-4">
        <img
          src="/homefront-logo.png"
          alt="HomeFront"
          className="w-64 h-auto"
          draggable={false}
        />
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    </div>
  );
}
