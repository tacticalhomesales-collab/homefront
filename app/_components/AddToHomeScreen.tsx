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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
    setIsIOS(ios);

    // Capture beforeinstallprompt for Android/Chrome
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
          <h2 className="text-xl font-extrabold text-white">Add to Home Screen</h2>
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
              <p className="text-white/80 text-center">
                Save HomeFront to your Home Screen for quick access to your referral link and QR code.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ff385c] flex items-center justify-center font-bold text-white">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">Tap the Share icon</p>
                    <p className="text-sm text-white/60">
                      Tap{" "}
                      <svg className="inline w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z" />
                      </svg>{" "}
                      in your browser's menu bar
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ff385c] flex items-center justify-center font-bold text-white">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">Select "Add to Home Screen"</p>
                    <p className="text-sm text-white/60">
                      Scroll down and tap "Add to Home Screen"
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ff385c] flex items-center justify-center font-bold text-white">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">Tap "Add"</p>
                    <p className="text-sm text-white/60">
                      Confirm to add HomeFront to your Home Screen
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleIOSDone}
                className="w-full py-4 bg-[#ff385c] hover:bg-[#ff385c]/90 rounded-xl text-white font-extrabold text-lg transition shadow-lg"
              >
                Done
              </button>
            </div>
          ) : deferredPrompt ? (
            // Android with prompt available
            <div className="space-y-6">
              <p className="text-white/80 text-center">
                Save HomeFront to your Home Screen for quick access to your referral link and QR code.
              </p>

              <button
                type="button"
                onClick={handleAndroidInstall}
                className="w-full py-4 bg-[#ff385c] hover:bg-[#ff385c]/90 rounded-xl text-white font-extrabold text-lg transition shadow-lg"
              >
                Add to Home Screen
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 text-white/60 hover:text-white transition text-sm font-semibold"
              >
                Maybe Later
              </button>
            </div>
          ) : (
            // Fallback for browsers without prompt
            <div className="space-y-6">
              <p className="text-white/80 text-center">
                Use your browser's menu to add HomeFront to your Home Screen.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-4 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-white font-bold transition"
              >
                Got it
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
