// Backup of previous app/partner/dashboard/page.tsx before major cleanup
// Saved on 2026-01-21

"use client";

import { useEffect, useState } from "react";
import { PartnerShareBox } from "@/components/PartnerShareBox";

export default function PartnerDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/partner/leads").then(r => r.json()).then(setData);
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">
        Partner Dashboard
      </h1>

      <p className="mt-2">“You bring the trust. We bring the expertise.”</p>

      {data?.leads?.map((l: any) => (
        <div key={l.id} className="mt-3 rounded-xl border p-3">
          <div>{l.name}</div>
          <a href={`tel:${l.phone}`} className="text-blue-400">
            {l.phone}
          </a>
        </div>
      ))}

      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Incentives</h2>
        <ul className="list-disc ml-6 text-white/80">
          <li>Ambassador: $100 per qualified lead + $500 per closed transaction.</li>
          <li>Realtor: $100 per qualified lead + up to $5,000 per closed referral.</li>
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Qualified Lead</h2>
        <ul className="list-disc ml-6 text-white/80">
          <li>Lead completes intake form</li>
          <li>Lead is represented by HomeFront or partner</li>
          <li>Lead is connected with a lender</li>
        </ul>
        <p className="mt-2 text-xs">
          Qualification is confirmed through our standard verification process and may require completion of necessary intake, representation, and/or lender steps.
        </p>
      </div>

      {/* Share tools (QR, etc.) would go here, e.g.: */}
      {/* <PartnerShareBox refCode={data?.partner?.refCode} referralUrl={data?.partner?.referralUrl} /> */}
    </main>
  );
}
