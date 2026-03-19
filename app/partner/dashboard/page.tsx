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
          <li>Ambassador: $100 reward for each Qualified Affiliate Signup attributed to your code, up to $3,000/month.</li>
          <li>Realtor: Marketing rewards for Qualified Affiliate Signups, plus any performance bonuses administered through your brokerage where allowed.</li>
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Qualified Affiliate Signup</h2>
        <ul className="list-disc ml-6 text-white/80">
          <li>A new household joins HomeFront using your link or QR code.</li>
          <li>They complete a quick intake so we can understand their housing goals.</li>
          <li>They get prequalified by a participating lender.</li>
          <li>They sign a buyer-broker agreement with a participating agent.</li>
          <li>They are not already active in our system under the same phone or email.</li>
        </ul>
        <p className="mt-2 text-xs">
          This definition is designed to prevent spam and duplicate submissions. Rewards are based on Qualified Affiliate Signups, not on whether anyone buys or sells a home.
        </p>
      </div>

      {/* Share tools (QR, etc.) would go here, e.g.: */}
      {/* <PartnerShareBox refCode={data?.partner?.refCode} referralUrl={data?.partner?.referralUrl} /> */}
    </main>
  );
}
