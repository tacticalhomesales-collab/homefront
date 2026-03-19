"use client";

import { useEffect, useState } from "react";

type AddToHomeScreenProps = {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
};

export default function AddToHomeScreen({
  isOpen,
  onClose,
  onComplete,
}: AddToHomeScreenProps) {
  const [isIOS, setIsIOS] = useState(false);
  // The browser's beforeinstallprompt event is not strongly typed across environments.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsIOS(ios);

    // Capture beforeinstallprompt for Android/Chrome
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      onClose();
      onComplete?.();
    }
  };

  const handleIOSDone = () => {
    onClose();
    onComplete?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0b0f14] border border-white/15 rounded-t-3xl sm:rounded-3xl w-full max-w-md mx-4 mb-0 sm:mb-4">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white">Add HomeFront to Home Screen</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center transition"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {isIOS ? (
            // iOS Instructions
            <div className="space-y-6">
              <div className="text-white/80 space-y-3">
                <p className="font-semibold text-center">
                  Add <span className="text-[#ff385c] font-extrabold">HomeFront</span> to your Home Screen:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Tap the <span className="font-semibold">Share</span> button in Safari&rsquo;s toolbar.</li>
                  <li>Scroll down and tap <span className="font-semibold">Add to Home Screen</span>.</li>
                  <li>Tap <span className="font-semibold">Add</span> in the top-right corner.</li>
                </ol>
                <p className="text-[13px] text-center text-white/70">
                  After that, just tap the HomeFront icon on your Home Screen anytime to come back.
                </p>
              </div>

              <button
                type="button"
                onClick={handleIOSDone}
                className="w-full py-4 bg-[#ff385c] hover:bg-[#ff385c]/90 rounded-xl text-white font-extrabold text-lg transition shadow-lg"
              >
                OK
              </button>
            </div>
          ) : deferredPrompt ? (
            // Android with prompt available
            <div className="space-y-6">
              <div className="text-center text-white/80">
                <p className="font-semibold">
                  Tap the <span className="text-[#ff385c] font-extrabold">HomeFront</span> logo on your Home Screen anytime to refer friends and earn passive income.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAndroidInstall}
                className="w-full py-4 bg-[#ff385c] hover:bg-[#ff385c]/90 rounded-xl text-white font-extrabold text-lg transition shadow-lg"
              >
                OK
              </button>
            </div>
          ) : (
            // Fallback for browsers without prompt
            <div className="space-y-6">
              <div className="text-center text-white/80">
                <p className="font-semibold">
                  Tap the <span className="text-[#ff385c] font-extrabold">HomeFront</span> logo on your Home Screen anytime to refer friends and earn passive income.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-4 bg-[#ff385c] hover:bg-[#ff385c]/90 rounded-xl text-white font-extrabold text-lg transition shadow-lg"
              >
                OK
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
