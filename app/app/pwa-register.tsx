"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    homefrontDeferredPrompt?: any;
  }
}

export default function PwaRegister() {
  useEffect(() => {
    // Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.warn("SW register failed:", err));
    }

    // Capture install prompt globally so any page can use it later
    const onBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      window.homefrontDeferredPrompt = e;
      window.dispatchEvent(new Event("homefront:install-ready"));
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt as any);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        onBeforeInstallPrompt as any
      );
    };
  }, []);

  return null;
}
