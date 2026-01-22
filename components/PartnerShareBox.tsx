"use client";

import { QRCodeBox } from "@/components/QRCodeBox";

export function PartnerShareBox({
  refCode,
  referralUrl,
}: {
  refCode: string;
  referralUrl: string;
}) {
  return (
    <div>
      <h3>Your Code: {refCode}</h3>
      <QRCodeBox value={referralUrl} />
    </div>
  );
}
