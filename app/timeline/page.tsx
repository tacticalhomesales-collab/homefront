import React from "react";

export default function TimelinePage() {
  return (
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-extrabold mb-4">Timeline</h1>
        <p className="text-lg text-gray-300 mb-8">See your progress and next steps for your journey.</p>
        {/* TODO: Add timeline details per channel (buy, sell, rent, manage) */}
        <div className="bg-white/5 rounded-xl p-6 text-left">
          <ul className="list-disc pl-5 text-gray-200">
            <li>Step 1: Start your journey</li>
            <li>Step 2: Complete required actions</li>
            <li>Step 3: Review and finalize</li>
            <li>Step 4: Celebrate your success!</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
